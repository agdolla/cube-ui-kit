import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { CloseOutlined } from '@ant-design/icons';
import Block from './Block';
import Action from './Action';
import Space from './Space';
import Flex from './Flex';

const FileTabsContext = createContext({});

const TABS_PANEL_CSS = `
  position: relative;
  overflow: auto hidden;
  top: 1px;
  white-space: nowrap;

  ::-webkit-scrollbar-track {
    background: var(--grey-light-color);
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 1px;
    background: var(--dark-04-color);
    background-clip: padding-box;
  }

  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  ::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }
`;

const TABS_CONTAINER_CSS = `
  position: relative;

  &::before {
    content: '';
    display: block;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    width: 32px;
    height: 37px;
    transition: all .15s linear;
    background-image: linear-gradient(
      to left,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1)
    );
    z-index: 10;
  }

  &::after {
    content: '';
    display: block;
    opacity: 0;
    position: absolute;
    top: 0;
    right: 0;
    width: 32px;
    height: 37px;
    pointer-events: none;
    transition: all .15s linear;
    background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1)
    );
    z-index: 10;
  }
  
  &[data-is-left-fade]::before, &[data-is-right-fade]::after {
    opacity: 1;
  }
`;

const DIRTY_BADGE_CSS = `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all .2s linear;
`;

const TAB_STYLES = {
  radius: '1r 1r 0 0',
  padding: '1x 1.5x',
  border: {
    '': 'left top right #clear',
    disabled: 'left top right',
  },
  fill: {
    '': '#dark.04',
    hovered: '#dark.12',
    'disabled, disabled & hover': '#white',
  },
  color: {
    '': '#dark',
    disabled: '#dark.75',
  },
  cursor: {
    '': 'pointer',
    disabled: 'default',
  },
  fontWeight: 500,
  opacity: 1,
  size: 'md',
  outline: {
    '': 'inset #purple-03.0',
    'focused & focus-visible': 'inset #purple-03',
  },
};

const CLOSE_STYLES = {
  color: {
    '': '#dark.50',
    hovered: '#dark',
  },
  padding: '0 .25x',
  outline: {
    '': '#purple-03.0',
    'focused & focus-visible': '#purple-03',
  },
  radius: '1r',
};

const TAB_CSS = `
  &.file-tab--dirty {
    &:hover {
      & .file-tab-dirty-badge {
        opacity: 0;
        pointer-events: none;
      }
      
      & .file-tab-close {
        opacity: 1;
      }
    }
    
    &:not(:hover) {
      & .file-tab-dirty-badge {
        opacity: 1;
      }
      
      & .file-tab-close {
        opacity: 0;
      }
    }  
  }
`;

const Tab = ({ dirty, children, onClose, ...props }) => {
  return (
    <Action
      className={dirty ? 'file-tab--dirty' : ''}
      css={TAB_CSS}
      styles={TAB_STYLES}
      {...props}
    >
      <Space gap=".75x">
        <Block>{children}</Block>
        <Flex items="center" style={{ position: 'relative' }}>
          <Action
            onClick={onClose}
            className="file-tab-close"
            styles={CLOSE_STYLES}
          >
            <CloseOutlined />
          </Action>
          {dirty ? (
            <Block
              className="file-tab-dirty-badge"
              css={DIRTY_BADGE_CSS}
              width="1x"
              height="1x"
              fill="#dark.30"
              radius="round"
            />
          ) : null}
        </Flex>
      </Space>
    </Action>
  );
};

export default function FileTabs({
  defaultActiveKey,
  activeKey: activeKeyProp,
  onTabClick,
  onTabClose,
  paneStyles,
  children,
  ...props
}) {
  const tabsRef = useRef();

  const [tabs, setTabs] = useState([]);
  const [activeKey, setActiveKey] = useState(activeKeyProp || defaultActiveKey);

  const [leftFade, setLeftFade] = useState(false);
  const [rightFade, setRightFade] = useState(false);

  function updateScroll() {
    const el = tabsRef && tabsRef.current;

    if (!el) return;

    setLeftFade(!!el.scrollLeft);
    setRightFade(
      el.scrollWidth !== el.offsetWidth &&
        !!(el.scrollWidth - el.offsetWidth - el.scrollLeft),
    );
  }

  useLayoutEffect(updateScroll, [tabs]);

  function scrollCurrentIntoView() {
    const el = tabsRef && tabsRef.current;

    if (!el) return;

    const current = el.querySelector('button[disabled]');

    if (!current) return;

    current.scrollIntoView({ behavior: 'smooth', inline: 'end', block: 'end' });
  }

  useEffect(() => {
    function update() {
      updateScroll();
    }

    if (tabsRef && tabsRef.current) {
      tabsRef.current.addEventListener('scroll', update);
      tabsRef.current.addEventListener('mousewheel', update);
      window.addEventListener('resize', update);
    }

    return () => {
      if (tabsRef && tabsRef.current) {
        tabsRef.current.removeEventListener('scroll', update);
        tabsRef.current.removeEventListener('mousewheel', update);
      }

      window.removeEventListener('resize', update);
    };
  }, [tabsRef]);

  useEffect(scrollCurrentIntoView, [activeKey]);

  useEffect(() => {
    setActiveKey(activeKeyProp);
  }, [activeKeyProp]);

  function getTab(tabs, key) {
    return tabs.find((tab) => tab.id === key);
  }

  function setTab(key) {
    if (getTab(tabs, key)) {
      setActiveKey(key);
    }
  }

  function addTab(tab) {
    setTabs((tabs) => {
      if (!getTab(tabs, tab.id)) {
        return [...tabs, tab];
      }

      return tabs;
    });
  }

  function setDirtyTab(id, isDirty) {
    setTabs((tabs) => {
      const tab = getTab(tabs, id);

      if (tab) {
        tab.dirty = isDirty;

        return [...tabs];
      }

      return tabs;
    });
  }

  function handleClose(tab) {
    if (getTab(tabs, tab.id)) {
      onTabClose && onTabClose(tab.id);
    }
  }

  function removeTab(tab) {
    setTabs((tabs) => {
      const _tabs = tabs.filter((_tab) => _tab.id !== tab.id);

      setActiveKey((prevActiveKey) => {
        if (prevActiveKey === tab.id) {
          return _tabs[0] && _tabs[0].id;
        }

        return prevActiveKey;
      });

      return _tabs;
    });
  }

  function onClick(tab) {
    setTab(tab.id);
    onTabClick && onTabClick(tab.id);
  }

  return (
    <Flex
      flow="column"
      data-is-left-fade={leftFade || null}
      data-is-right-fade={rightFade || null}
      css={TABS_CONTAINER_CSS}
      {...props}
    >
      <FileTabsContext.Provider
        value={{
          addTab,
          setTab,
          removeTab,
          setDirtyTab,
          currentTab: activeKey,
        }}
      >
        <Space ref={tabsRef} gap=".5x" shrink="0" css={TABS_PANEL_CSS}>
          {tabs.map((tab) => {
            return (
              <Tab
                onClick={() => onClick(tab)}
                key={tab.id}
                onClose={() => handleClose(tab)}
                disabled={tab.id === activeKey || null}
                dirty={tab.dirty}
              >
                {tab.title}
              </Tab>
            );
          })}
        </Space>
        <Flex grow="1" border="top" {...(paneStyles || {})}>
          {children}
        </Flex>
      </FileTabsContext.Provider>
    </Flex>
  );
}

FileTabs.TabPane = function FileTabPane({
  id,
  tab,
  dirty,
  children,
  ...props
}) {
  const { addTab, removeTab, currentTab, setDirtyTab } = useContext(
    FileTabsContext,
  );

  useEffect(() => {
    const tabData = {
      id,
      title: tab,
      dirty,
    };

    addTab(tabData);

    return () => {
      removeTab(tabData);
    };
  }, [id, tab]);

  useEffect(() => {
    setDirtyTab(id, dirty);
  }, [dirty]);

  const isCurrent = id === currentTab;

  return (
    <Block
      style={{ display: isCurrent ? 'block' : 'none' }}
      grow="1"
      {...props}
    >
      {children}
    </Block>
  );
};
