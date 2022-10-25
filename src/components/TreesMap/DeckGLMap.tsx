import React, { ReactNode } from 'react';
import { Map as MapboxMap, MapboxGeoJSONFeature } from 'mapbox-gl';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import {
  StaticMap,
  GeolocateControl,
  NavigationControl,
  ViewportProps,
  FlyToInterpolator,
} from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
import { easeCubic as d3EaseCubic, ExtendedFeatureCollection } from 'd3';
import { interpolateColor, hexToRgb } from '../../utils/colorUtil';
import {
  CommunityDataType,
  StoreProps,
  TreeGeojsonFeatureProperties,
} from '../../common/interfaces';
import { pumpToColor } from './mapColorUtil';
import { MapTooltip } from './MapTooltip';
import {
  getWaterNeedByAge,
  YOUNG_TREE_MAX_AGE,
  OLD_TREE_MIN_AGE,
  LOW_WATER_NEED_NUM,
  MEDIUM_WATER_NEED_NUM,
  HIGH_WATER_NEED_NUM,
} from '../../utils/getWaterNeedByAge';

import 'mapbox-gl/dist/mapbox-gl.css';

interface StyledProps {
  isNavOpen?: boolean;
}
const ControlWrapper = styled.div<StyledProps>`
  position: fixed;
  bottom: 12px;
  left: 12px;
  z-index: 2;
  transition: transform 500ms;

  @media screen and (min-width: ${p => p.theme.screens.tablet}) {
    transform: ${props =>
      props.isNavOpen ? 'translate3d(350px, 0, 0)' : 'translate3d(0, 0, 0)'};
  }

  & > div {
    position: static !important;
  }
`;

let map: MapboxMap | null = null;
let selectedStateId: string | number | undefined = undefined;

const VIEWSTATE_TRANSITION_DURATION = 1000;
const VIEWSTATE_ZOOMEDIN_ZOOM = 19;
const colors = {
  transparent: [200, 200, 200, 0] as [number, number, number, number],
  blue: [53, 117, 177, 200] as [number, number, number, number],
  turquoise: [0, 128, 128, 200] as [number, number, number, number],
  red: [247, 105, 6, 255] as [number, number, number, number],
};

interface DeckGLPropType {
  rainGeojson: ExtendedFeatureCollection | null;

  visibleMapLayer: StoreProps['visibleMapLayer'];
  ageRange: StoreProps['ageRange'];
  mapViewFilter: StoreProps['mapViewFilter'];
  mapWaterNeedFilter: StoreProps['mapWaterNeedFilter'];
  isNavOpen: StoreProps['isNavOpen'];
  focusPoint: StoreProps['mapFocusPoint'];

  pumpsGeoJson: ExtendedFeatureCollection | null;
  selectedTreeId: string | undefined;
  communityData: CommunityDataType['communityFlagsMap'];
  communityDataWatered: CommunityDataType['wateredTreesIds'];
  communityDataAdopted: CommunityDataType['adoptedTreesIds'];

  showControls: boolean | undefined;
  onTreeSelect: (id: string) => void;
}

interface ViewportType extends Partial<ViewportProps> {
  latitude: ViewportProps['latitude'];
  longitude: ViewportProps['longitude'];
  zoom: ViewportProps['zoom'];
}

interface PumpPropertiesType {
  id?: number;
  address: string;
  status: string;
  check_date: string;
  style: string;
}

interface PumpTooltipType extends PumpPropertiesType {
  x: number;
  y: number;
}

interface PumpEventInfo {
  x: number;
  y: number;
  object?: {
    properties?:
      | {
          id: number;
          'pump:status'?: string;
          'addr:full'?: string;
          'pump:style'?: string;
          check_date?: string;
        }
      | undefined;
  };
}

interface DeckGLStateType {
  hoveredPump: PumpTooltipType | null;
  clickedPump: PumpTooltipType | null;
  cursor: 'grab' | 'pointer';
  geoLocationAvailable: boolean;
  isTreeMapLoading: boolean;
  viewport: ViewportType;
}

const StyledTextLink = styled.a`
  color: black;
`;

const pumpEventInfoToState = (info: PumpEventInfo) => {
  if (info && info.object && info.object.properties) {
    return {
      id: info.object.properties.id,
      address: info.object.properties['addr:full'] || '',
      check_date: info.object.properties['check_date'] || '',
      status: info.object.properties['pump:status'] || '',
      style: info.object.properties['pump:style'] || '',
      x: info.x,
      y: info.y,
    };
  }
  return null;
};

const getOSMEditorURL = (nodeId: number) => {
  const mapcompleteUrl = 'https://mapcomplete.osm.be/theme';
  const params = new URLSearchParams();
  params.set(
    'userlayout',
    'https://tordans.github.io/MapComplete-ThemeHelper/OSM-Berlin-Themes/man_made-walter_well-status-checker/theme.json'
  );
  params.set('language', 'de');
  const selectedPump = `#node/${nodeId}`;
  return `${mapcompleteUrl}?${params.toString()}${selectedPump}`;
};

class DeckGLMap extends React.Component<DeckGLPropType, DeckGLStateType> {
  constructor(props: DeckGLPropType) {
    super(props);

    this.state = {
      hoveredPump: null,
      clickedPump: null,
      cursor: 'grab',
      geoLocationAvailable: false,
      isTreeMapLoading: true,
      viewport: {
        latitude: 52.500869,
        longitude: 13.419047,
        zoom: isMobile ? 13 : 11,
        maxZoom: VIEWSTATE_ZOOMEDIN_ZOOM,
        minZoom: isMobile ? 11 : 9,
        pitch: isMobile ? 0 : 45,
        bearing: 0,
        transitionDuration: 2000,
        transitionEasing: d3EaseCubic,
        transitionInterpolator: new FlyToInterpolator(),
      },
    };

    this._onClick = this._onClick.bind(this);
    this._updateStyles = this._updateStyles.bind(this);
    this._deckClick = this._deckClick.bind(this);
    this.setCursor = this.setCursor.bind(this);
    this.onViewStateChange = this.onViewStateChange.bind(this);
  }

  _getFillColor(info: {
    properties: TreeGeojsonFeatureProperties;
  }): [number, number, number, number] {
    const {
      ageRange,
      mapViewFilter,
      mapWaterNeedFilter,
      communityData,
    } = this.props;
    const [minFilteredAge, maxFilteredAge] = ageRange;
    const { properties } = info;
    const { id, radolan_sum, age: treeAge } = properties;
    const communityDataFlatMap = communityData && id && communityData[id];
    const { isWatered, isAdopted } = communityDataFlatMap || {};
    const waterNeed = getWaterNeedByAge(treeAge);

    const rainDataExists = !!radolan_sum;

    const ageFilterIsApplied = minFilteredAge !== 0 || maxFilteredAge !== 320; // TODO: how to not hard-code these values?

    const treeIsWithinAgeRange =
      treeAge && treeAge >= minFilteredAge && treeAge <= maxFilteredAge;

    const colorsShallBeInterpolated =
      rainDataExists &&
      ((ageFilterIsApplied && treeIsWithinAgeRange) || !ageFilterIsApplied);

    const colorShallBeTransparent =
      (ageFilterIsApplied && !treeAge) ||
      (ageFilterIsApplied && !treeIsWithinAgeRange) ||
      (mapWaterNeedFilter && waterNeed !== mapWaterNeedFilter) ||
      !rainDataExists;

    if (colorShallBeTransparent) return colors.transparent;

    if (mapViewFilter === 'watered') {
      return communityDataFlatMap &&
        isWatered &&
        (ageFilterIsApplied ? treeIsWithinAgeRange : true)
        ? colors.blue
        : colors.transparent;
    }

    if (mapViewFilter === 'adopted') {
      return communityDataFlatMap &&
        isAdopted &&
        (ageFilterIsApplied ? treeIsWithinAgeRange : true)
        ? colors.turquoise
        : colors.transparent;
    }

    if (colorsShallBeInterpolated) {
      // Note: we do check if radolan_sum is defined by checking for rainDataExists, that's why the ts-ignore
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const interpolated = interpolateColor(radolan_sum);
      const hex = hexToRgb(interpolated);

      return hex;
    }

    return colors.transparent;
  }

  _renderLayers(): unknown[] {
    const { rainGeojson, visibleMapLayer, pumpsGeoJson } = this.props;

    if (!rainGeojson || !pumpsGeoJson) return [];
    const layers = [
      new GeoJsonLayer({
        id: 'rain',
        data: rainGeojson as any,
        opacity: 0.95,
        visible: visibleMapLayer === 'rain' ? true : false,
        stroked: false,
        filled: true,
        extruded: true,
        wireframe: true,
        getElevation: 1,
        getFillColor: f => {
          /**
           * Apparently DWD 1 is not 1ml but 0.1ml
           * We could change this in the database, but this would mean,
           * transferring 800.000 "," characters, therefore,
           * changing it client-side makes more sense.
           */
          const interpolated = interpolateColor(
            (f as any).properties.data[0] / 10
          );
          const hex = hexToRgb(interpolated);
          return hex;
        },
        pickable: true,
      }),
      new GeoJsonLayer({
        id: 'pumps',
        data: pumpsGeoJson as any,
        opacity: 1,
        visible: visibleMapLayer === 'pumps' ? true : false,
        stroked: true,
        filled: true,
        extruded: true,
        wireframe: true,
        getElevation: 1,
        getLineColor: [0, 0, 0, 200],
        getFillColor: pumpToColor,
        getRadius: 9,
        pointRadiusMinPixels: 4,
        pickable: true,
        lineWidthScale: 3,
        lineWidthMinPixels: 1.5,
        onHover: (info: PumpEventInfo) => {
          this.setState({
            hoveredPump: pumpEventInfoToState(info),
          });
        },
        onClick: (info: PumpEventInfo) => {
          this.setState({
            clickedPump: pumpEventInfoToState(info),
          });
        },
      }),
    ];

    return layers;
  }

  _deckClick(event: { x: number; y: number }): void {
    if (!map) return;

    if (selectedStateId) {
      map.setFeatureState(
        { sourceLayer: 'original', source: 'trees', id: selectedStateId },
        { select: false }
      );
      selectedStateId = undefined;
    }
    const features = map.queryRenderedFeatures([event.x, event.y], {
      layers: ['trees'],
    });

    if (features.length === 0) return;

    this._onClick(event.x, event.y, features[0]);

    if (!features[0].properties) return;

    map.setFeatureState(
      { sourceLayer: 'original', source: 'trees', id: features[0].id },
      { select: true }
    );
    selectedStateId = features[0].id;
  }

  setViewport(viewport: Partial<ViewportType>): void {
    this.setState({
      viewport: {
        ...this.state.viewport,
        ...viewport,
      },
    });
  }

  _onClick(
    _x: number,
    _y: number,
    object: Partial<MapboxGeoJSONFeature>
  ): void {
    const id: string = object.properties?.id;
    if (!id) return;

    this.props.onTreeSelect(id);
  }

  setCursor(val: unknown): void {
    if (val) {
      this.setState({ cursor: 'pointer' });
    } else {
      this.setState({ cursor: 'grab' });
    }
  }

  _onload(evt: { target: MapboxMap }): void {
    map = evt.target;

    const { visibleMapLayer } = this.props;

    if (!map || typeof map === 'undefined') return;

    const firstLabelLayerId = map
      .getStyle()
      .layers?.find(layer => layer.type === 'symbol')?.id;

    if (!firstLabelLayerId) return;

    map.addLayer(
      {
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 0,
        paint: {
          'fill-extrusion-color': '#FFF',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height'],
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height'],
          ],
          'fill-extrusion-opacity': 0.3,
        },
      },
      firstLabelLayerId
    );

    // disable map rotation using right click + drag
    map.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

    map.addSource('trees', {
      type: 'vector',
      url: process.env.MAPBOX_TREES_TILESET_URL,
      minzoom: 11,
      maxzoom: 20,
    });

    map.addLayer({
      id: 'trees',
      type: 'circle',
      source: 'trees',
      'source-layer': process.env.MAPBOX_TREES_TILESET_LAYER,
      layout: {
        visibility: visibleMapLayer === 'trees' ? 'visible' : 'none',
      },
      // TODO: Below we add the style for the trees on mobile. The color updates should be inserted or replicated here.
      paint: {
        'circle-radius': {
          base: 1.75,
          stops: [
            [11, 1],
            [22, 100],
          ],
        },
        'circle-opacity': 1,
        'circle-stroke-color': 'rgba(247, 105, 6, 1)',
        'circle-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          'rgba(200,200,200,1)',
          [
            'interpolate',
            ['linear'],
            ['get', 'radolan_sum'],
            0,
            interpolateColor(0),
            600,
            interpolateColor(60),
            1200,
            interpolateColor(120),
            1800,
            interpolateColor(180),
            2400,
            interpolateColor(240),
            3000,
            interpolateColor(300),
          ],
        ],
        'circle-stroke-width': [
          'case',
          ['boolean', ['feature-state', 'select'], false],
          15,
          0,
        ],
      },
    });

    this.setState({ isTreeMapLoading: false });

    if (!this.props.focusPoint) return;
    this.setViewport({
      latitude: this.props.focusPoint.latitude,
      longitude: this.props.focusPoint.longitude,
      zoom: this.props.focusPoint.zoom || VIEWSTATE_ZOOMEDIN_ZOOM,
      transitionDuration: VIEWSTATE_TRANSITION_DURATION,
    });
  }

  _updateStyles(prevProps: DeckGLPropType): void {
    if (map) {
      if (this.props.visibleMapLayer !== 'trees') {
        map.setLayoutProperty('trees', 'visibility', 'none');
      } else {
        map.setLayoutProperty('trees', 'visibility', 'visible');
      }
      if (prevProps.ageRange !== this.props.ageRange) {
        map.setPaintProperty('trees', 'circle-opacity', [
          'case',
          ['>=', ['get', 'age'], this.props.ageRange[0]],
          ['case', ['<=', ['get', 'age'], this.props.ageRange[1]], 1, 0],
          0,
        ]);
      }
      let communityFilter: unknown[] | null = null;
      let waterNeedFilter: unknown[] | null = null;
      if (this.props.mapViewFilter === 'watered') {
        // TODO: check if there is a performance up for any of the two
        // ['in', ['get', 'id'], ['literal', [1, 2, 3]]]
        communityFilter = [
          'match',
          ['get', 'id'],
          this.props.communityDataWatered,
          true,
          false,
        ];
      } else if (this.props.mapViewFilter === 'adopted') {
        communityFilter = [
          'match',
          ['get', 'id'],
          this.props.communityDataAdopted,
          true,
          false,
        ];
      }
      if (this.props.mapWaterNeedFilter !== null) {
        waterNeedFilter = [
          'match',
          [
            'case',
            ['<', ['get', 'age'], OLD_TREE_MIN_AGE],
            [
              'case',
              ['<', ['get', 'age'], YOUNG_TREE_MAX_AGE],
              HIGH_WATER_NEED_NUM,
              MEDIUM_WATER_NEED_NUM,
            ],
            LOW_WATER_NEED_NUM,
          ],
          this.props.mapWaterNeedFilter,
          true,
          false,
        ];
      }

      map.setFilter(
        'trees',
        ['all', communityFilter, waterNeedFilter].filter(val => val !== null)
      );
    }
  }

  componentDidUpdate(prevProps: DeckGLPropType): boolean {
    if (!map) return false;
    const mapProps = [
      'communityData',
      'ageRange',
      'mapViewFilter',
      'mapWaterNeedFilter',
      'treesVisible',
      'visibleMapLayer',
      'selectedTreeId',
      'focusPoint',
    ];
    let changed = false;
    mapProps.forEach(prop => {
      if (prevProps[prop] !== this.props[prop]) {
        changed = true;
      }
    });

    if (!changed) return false;
    this._updateStyles(prevProps);

    if (
      this.props.focusPoint &&
      prevProps.focusPoint?.id !== this.props.focusPoint?.id
    ) {
      this.setViewport({
        latitude: this.props.focusPoint.latitude,
        longitude: this.props.focusPoint.longitude,
        zoom: this.props.focusPoint.zoom || VIEWSTATE_ZOOMEDIN_ZOOM,
        transitionDuration: VIEWSTATE_TRANSITION_DURATION,
      });
    }

    return true;
  }

  onViewStateChange(viewport: ViewportProps): void {
    this.setState({ clickedPump: null, hoveredPump: null });
    this.setViewport({
      latitude: viewport.latitude,
      longitude: viewport.longitude,
      zoom: viewport.zoom,
      transitionDuration: 0,
    });
  }

  render(): ReactNode {
    const { isNavOpen, showControls } = this.props;
    const { viewport, clickedPump, hoveredPump } = this.state;
    const pumpInfo = clickedPump || hoveredPump;

    return (
      <>
        <DeckGL
          layers={this._renderLayers() as any}
          initialViewState={viewport}
          viewState={viewport as any}
          getCursor={() => this.state.cursor}
          onHover={({ layer }) => this.setCursor(layer)}
          onClick={this._deckClick}
          onViewStateChange={e => this.onViewStateChange(e.viewState)}
          controller
          style={{ overflow: 'hidden' }}
        >
          <StaticMap
            reuseMaps
            mapStyle='mapbox://styles/technologiestiftung/ckke3kyr00w5w17mytksdr3ro'
            preventStyleDiffing={true}
            mapboxApiAccessToken={process.env.MAPBOX_API_KEY}
            onLoad={this._onload.bind(this)}
            width='100%'
            height='100%'
          >
            {!showControls && (
              <ControlWrapper isNavOpen={isNavOpen}>
                <GeolocateControl
                  positionOptions={{ enableHighAccuracy: true }}
                  trackUserLocation={isMobile ? true : false}
                  showUserLocation={true}
                  onGeolocate={posOptions => {
                    const {
                      coords: { latitude, longitude },
                    } = (posOptions as unknown) as {
                      coords: {
                        latitude: number;
                        longitude: number;
                      };
                    };
                    this.setState({ clickedPump: null, hoveredPump: null });
                    this.setViewport({
                      longitude,
                      latitude,
                      zoom: VIEWSTATE_ZOOMEDIN_ZOOM,
                      transitionDuration: VIEWSTATE_TRANSITION_DURATION,
                    });
                  }}
                />
                <NavigationControl
                  onViewStateChange={e => {
                    this.setViewport({
                      latitude: e.viewState.latitude,
                      longitude: e.viewState.longitude,
                      zoom: e.viewState.zoom,
                      transitionDuration: VIEWSTATE_TRANSITION_DURATION,
                    });
                    this.setState({ clickedPump: null, hoveredPump: null });
                  }}
                />
              </ControlWrapper>
            )}
          </StaticMap>
        </DeckGL>
        {pumpInfo && pumpInfo.x && pumpInfo.y && (
          <MapTooltip
            x={pumpInfo.x}
            y={pumpInfo.y}
            title='Öffentliche Straßenpumpe'
            subtitle={pumpInfo.address}
            onClickOutside={() => {
              this.setState({ clickedPump: null });
            }}
            infos={{
              Status: pumpInfo.status,
              'Letzter Check': pumpInfo.check_date,
              Pumpenstil: pumpInfo.style,
              ...(pumpInfo.id
                ? {
                    '': (
                      <StyledTextLink
                        href={getOSMEditorURL(pumpInfo.id)}
                        target='_blank'
                        rel='noreferrer nofollow'
                      >
                        Status in OpenStreetMap aktualisieren
                      </StyledTextLink>
                    ),
                  }
                : {}),
            }}
          />
        )}
      </>
    );
  }
}

export default DeckGLMap;
