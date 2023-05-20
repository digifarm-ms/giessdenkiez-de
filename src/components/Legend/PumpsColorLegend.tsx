import React, { FC } from 'react';
import styled from 'styled-components';
import {
  workingColor,
  defaultColor,
  brokenColor,
  lockedColor,
} from '../TreesMap/mapColorUtil';
import { FlexRow, FlexColumn } from './LegendFlexBoxes';
import { PumpLabel } from './LegendLabels';
import { PumpsDot } from './LegendRectsDots';

const FlexRowDots = styled(FlexColumn)`
  flex-direction: row;
`;
export const PumpsColorLegend: FC = () => {
  return (
    <FlexRow>
      <FlexRowDots>
        <PumpsDot color={defaultColor.hex} size={13} />
        <PumpLabel>Wassercontainer</PumpLabel>
      </FlexRowDots>
    </FlexRow>
  );
};
