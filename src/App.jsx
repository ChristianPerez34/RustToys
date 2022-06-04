import { Fragment, useState, useEffect } from "react";
import "./App.css";
import {
  AppShell,
  Navbar,
  Header,
  Text,
  useMantineTheme,
  Grid,
  Group,
} from "@mantine/core";
import { IconContext } from "react-icons";
import {
  VscChromeMaximize,
  VscChromeRestore,
  VscChromeMinimize,
  VscClose,
  VscMenu,
} from "react-icons/vsc";
import { appWindow } from "@tauri-apps/api/window";

function App() {
  const theme = useMantineTheme();
  const iconSize = "24";
  const [opened, setOpened] = useState(true);
  const [navbarWidth, setNavbarWidth] = useState({ sm: 200, lg: 300 });
  const [isMaximized, setIsMaximized] = useState(false);

  /* Adding a listener to the window resize event. */
  useEffect(() => {
    const handleResize = async () => {
      setIsMaximized(await appWindow.isMaximized());
    };

    window.addEventListener("resize", handleResize);
  }, []);

  /**
   * If the navbar is opened, set the width to 200, otherwise set it to 100
   */
  const handleMenuClick = () => {
    let width = 200;
    if (opened) {
      width = 100;
    }
    setOpened((o) => !o);
    setNavbarWidth({ sm: width, lg: navbarWidth.lg });
  };

  /**
   * Toggles the window's maximized state and then updates the isMaximized state variable
   */
  const handleToggleMaximize = async () => {
    await appWindow.toggleMaximize();
    setIsMaximized(await appWindow.isMaximized());
  };

  return (
    <Fragment>
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        fixed
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={navbarWidth}
          >
            <Text>Application navbar</Text>
          </Navbar>
        }
        header={
          <Header height={60} p="md">
            <Grid data-tauri-drag-region>
              <Grid.Col span={3}>
                <VscMenu
                  size={iconSize}
                  color={theme.colors.gray[5]}
                  onClick={handleMenuClick}
                />
              </Grid.Col>
              <Grid.Col span={3} offset={6}>
                <Group position="right" spacing={"sm"}>
                  {/* Window Icons */}
                  <IconContext.Provider
                    value={{ style: { verticalAlign: "middle" } }}
                  >
                    <VscChromeMinimize
                      size={iconSize}
                      color={theme.colors.gray[5]}
                      onClick={() => appWindow.minimize()}
                    />
                    {isMaximized ? (
                      <VscChromeRestore
                        size={iconSize}
                        color={theme.colors.gray[5]}
                        onClick={handleToggleMaximize}
                      />
                    ) : (
                      <VscChromeMaximize
                        size={iconSize}
                        color={theme.colors.gray[5]}
                        onClick={handleToggleMaximize}
                      />
                    )}
                    <VscClose
                      size={iconSize}
                      onClick={() => appWindow.close()}
                      color={theme.colors.gray[5]}
                    />
                  </IconContext.Provider>
                </Group>
              </Grid.Col>
            </Grid>
          </Header>
        }
      >
        <Text>Resize app to see responsive navbar in action</Text>
      </AppShell>
    </Fragment>
  );
}

export default App;
