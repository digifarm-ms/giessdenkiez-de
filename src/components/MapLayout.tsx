import React, { FC } from 'react';
import Head from 'next/head';
import App from './App';
import SidebarWrapper from './Sidebar/SidbarWrapper';
import { useRouter } from 'next/router';

export const MapLayout: FC<{ treeId?: string | null }> = ({
  treeId,
  children,
}) => {
  const { pathname } = useRouter();
  return (
    <>
      <Head>
        <title>Münster schenkt aus</title>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        />
        <link rel='icon' type='image/x-icon' href='/images/favicon.ico' />
        <meta name='title' content='Münster schenkt aus' />
        <meta
          name='description'
          content='Die Münsteraner Straßenbäume leiden unter Trockenheit und Du kannst ihnen helfen!'
        />
        <meta property='og:url' content='<%= domain %>/' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Münster schenkt aus' />
        <meta
          property='og:description'
          content='Die Münsteraner Straßenbäume leiden unter Trockenheit und Du kannst ihnen helfen!'
        />
        <meta
          property='og:image'
          content='<%= domain %>/images/muenster-schenkt-aus.png'
        />
        <meta property='og:site_name' content='Münster schenkt aus' />
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:url' content='<%= domain %>/' />
        <meta name='twitter:title' content='Münster schenkt aus' />
        <meta
          name='twitter:description'
          content='Die Münsteraner Straßenbäume leiden unter Trockenheit und Du kannst ihnen helfen!'
        />
        <meta
          name='twitter:image'
          content='<%= domain %>/images/muenster-schenkt-aus.png'
        />
      </Head>
      <App treeId={treeId}>
        <SidebarWrapper isVisible={pathname !== '/'}>{children}</SidebarWrapper>
      </App>
    </>
  );
};
