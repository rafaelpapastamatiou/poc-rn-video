import { extendTheme, themeTools } from 'native-base';

export const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: 'dark',
  },
  colors: {
    brand: {
      "900": "#D30768",
    },
  },
  components: {
    Input: {
      baseStyle: (props: any) => {
        return {
          _android: {
            _focus: {
              borderColor: 'brand.900'
            },
          },
          _ios: {
            _focus: {
              borderColor: 'brand.900'
            },
          },
        }
      }
    },
    Button: {
      baseStyle: (props: any) => {
        return {
          _focus: {
            borderColor: 'brand.900'
          },
          _android: {
            _focus: {
              borderColor: 'brand.900'
            },
          },
          _ios: {
            _focus: {
              borderColor: 'brand.900'
            },
          },
        }
      }
    },
    Accordion: {
      baseStyle: (props: any) => {
        return {
          borderWidth: 0
        }
      }
    },
    AccordionSummary: {
      baseStyle: (props: any) => {
        return {
          _expanded: {
            bg: 'brand.900'
          }
        }
      }
    }
  },
})