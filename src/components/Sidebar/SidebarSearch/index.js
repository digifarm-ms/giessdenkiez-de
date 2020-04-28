import React from 'react';
import styled from 'styled-components';
import { connect } from 'unistore/react';
import Actions from '../../../state/Actions';

import SidebarTitle from '../SidebarTitle/';
import SidebarSearchAge from './SidebarSearchAge';
import SidebarLoadingCard from '../SidebarLoadingCard';
import Card from '../../Card/';
import CardLegend from '../../Card/CardLegend/';

const SidebarSearch = p => {
  const { selectedTree, selectedTreeState } = p;
  return (
    <>
      <SidebarTitle>Suche & Filter</SidebarTitle>
      {/* { !selectedTree && (<SidebarSearchAge/>)}
      { (selectedTreeState === 'LOADING') && (
        <SidebarLoadingCard state={selectedTreeState}/>
      ) }
      */}
      { (selectedTree && selectedTreeState !== 'LOADING') && (
        <Card data={selectedTree}/>
      )}
      {!selectedTree && (<CardLegend />)}
    </>
  )
}

export default connect(state => ({
  selectedTree: state.selectedTree,
  selectedTreeState: state.selectedTreeState,
}), Actions)(SidebarSearch);