import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import NativeSidebar from './NativeSidebar';
import { withTheme } from '../Theme';
import { useScreen } from '../Screen';
import { useHistory } from '../History';
import { useDerivedState, isSSR } from '../utils';
import Row from '../Row';

const Sidebar = ({
  leftOpen,
  rightOpen,
  leftOnChange,
  rightOnChange,
  leftComponent,
  rightComponent,
  edgeHitWidth,
  disabled,
  children,
}) => {
  const { location } = useHistory();

  const screen = useScreen();

  useDerivedState(location.pathname, () => {
    setTimeout(() => {
      if (leftOnChange) {
        leftOnChange(false);
      }
      if (rightOnChange) {
        rightOnChange(false);
      }
    });
  });

  if (isSSR()) {
    return <span style={{ width: '100%' }}>{children}</span>;
  }

  if (screen.type === 'xs' || screen.type === 'sm') {
    const styles = {
      sidebar: { width: Math.min(screen.width * 0.8, 400) },
    };
    if (leftComponent && rightComponent) {
      return (
        <NativeSidebar
          styles={styles}
          open={leftOpen}
          bounceBackOnOverdraw={false}
          sidebar={leftComponent}
          onSetOpen={leftOnChange}
          touchHandleWidth={edgeHitWidth}
          touch={!(disabled || rightOpen)}
        >
          <NativeSidebar
            styles={styles}
            open={rightOpen}
            bounceBackOnOverdraw={false}
            sidebar={rightComponent}
            pullRight
            onSetOpen={rightOnChange}
            touchHandleWidth={edgeHitWidth}
            touch={!disabled}
          >
            {children}
          </NativeSidebar>
        </NativeSidebar>
      );
    }
    if (leftComponent) {
      return (
        <NativeSidebar
          styles={styles}
          open={leftOpen}
          bounceBackOnOverdraw={false}
          sidebar={leftComponent}
          onSetOpen={leftOnChange}
          touchHandleWidth={edgeHitWidth}
          touch={!disabled}
        >
          {children}
        </NativeSidebar>
      );
    }
    if (rightComponent) {
      return (
        <NativeSidebar
          open={rightOpen}
          bounceBackOnOverdraw={false}
          sidebar={rightComponent}
          pullRight
          onSetOpen={rightOnChange}
          touchHandleWidth={edgeHitWidth}
          touch={!disabled}
        >
          {children}
        </NativeSidebar>
      );
    }
  }
  return <Row>{children}</Row>;
};

Sidebar.propTypes = {
  leftOpen: PropTypes.bool,
  leftOnChange: PropTypes.func,
  leftComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
  rightOpen: PropTypes.bool,
  rightOnChange: PropTypes.func,
  rightComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
  edgeHitWidth: PropTypes.number,
  children: PropTypes.node,
  disabled: PropTypes.bool,
};

Sidebar.defaultProps = {
  leftOpen: false,
  leftOnChange: noop,
  leftComponent: null,
  rightOpen: false,
  rightOnChange: noop,
  rightComponent: null,
  edgeHitWidth: 120,
  children: null,
  disabled: false,
};

export default withTheme('Sidebar')(Sidebar);
