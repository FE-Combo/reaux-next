import React from 'react';
import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../index';
import { AllState } from '../../../utils/state';
import dynamic from 'next/dynamic';
import Router from 'next/router';

const DynamicHomeView = dynamic(() => import('modules/about').then(_=>_.View), {ssr: false});

export default () => {
  const dispatch = useDispatch();
  const { name, loading } = useSelector((state: AllState) => ({
    name: state.home.name,
    loading: state['@loading'].button,
  }));
  const handleButtonClick = () => dispatch(actions.clickButton());
  const handleGlobalButtonClick = () => dispatch(actions.clickGlobalButton());
  const changeLang = (lang: string) => {
    console.info(lang);
  };

  return (
    <>
      <div className='home'>
        <span>{name}</span>
        &nbsp;&nbsp;
        <i18n>名字</i18n>
        <Button onClick={handleButtonClick} loading={!!loading}>
          局部加载
        </Button>
        &nbsp;&nbsp;
        <Button onClick={handleGlobalButtonClick}>全局加载</Button>
      </div>
      <br />
      <div>
        <span>语言：未设置</span>
        &nbsp;&nbsp;
        <Button onClick={() => changeLang('ZH')}>设置为中文</Button>
        &nbsp;&nbsp;
        <Button onClick={() => changeLang('EN')}>设置为英文</Button>
      </div>
      <Button onClick={() => Router.push('/home/detail')}>详情页</Button>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <DynamicHomeView />
    </>
  );
};
