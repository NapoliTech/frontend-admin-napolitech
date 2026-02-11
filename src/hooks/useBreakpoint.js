import { useTheme, useMediaQuery } from "@mui/material";

/**
 * Hook customizado para detecção de breakpoints do Material UI
 * Facilita a implementação de layouts responsivos
 * 
 * @returns {Object} Objeto com informações sobre o breakpoint atual
 * 
 * @example
 * const { isMobile, isTablet, isDesktop, currentBreakpoint } = useBreakpoint();
 * 
 * if (isMobile) {
 *   // Renderizar layout mobile
 * }
 */
export const useBreakpoint = () => {
  const theme = useTheme();

  // Breakpoints do Material UI
  const xs = useMediaQuery(theme.breakpoints.only("xs")); // 0-600px
  const sm = useMediaQuery(theme.breakpoints.only("sm")); // 600-900px
  const md = useMediaQuery(theme.breakpoints.only("md")); // 900-1200px
  const lg = useMediaQuery(theme.breakpoints.only("lg")); // 1200-1536px
  const xl = useMediaQuery(theme.breakpoints.only("xl")); // 1536px+

  // Queries úteis para lógica de negócio
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600-900px
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // >= 1200px
  
  // Específicos para comportamentos comuns
  const isSmallMobile = useMediaQuery("(max-width:375px)"); // iPhone SE, Galaxy Fold
  const isLargeMobile = useMediaQuery(theme.breakpoints.between(375, 600)); // iPhone 12+
  const isTabletPortrait = useMediaQuery("(min-width:600px) and (max-width:900px)");
  const isTabletLandscape = useMediaQuery("(min-width:900px) and (max-width:1200px)");

  // Determinar breakpoint atual
  let currentBreakpoint = "xl";
  if (xs) currentBreakpoint = "xs";
  else if (sm) currentBreakpoint = "sm";
  else if (md) currentBreakpoint = "md";
  else if (lg) currentBreakpoint = "lg";

  // Helpers para Grid columns
  const getGridColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (md) return 3;
    return 4;
  };

  // Helpers para Card layout
  const getCardSize = () => {
    if (isMobile) return { xs: 12 };
    if (isTablet) return { xs: 12, sm: 6 };
    if (md) return { xs: 12, sm: 6, md: 4 };
    return { xs: 12, sm: 6, md: 3 };
  };

  // Helpers para Padding
  const getPagePadding = () => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 4;
  };

  // Helpers para Sidebar
  const shouldCollapseSidebar = () => {
    return isMobile || isTablet;
  };

  // Helpers para DataGrid
  const getTablePageSize = () => {
    if (isMobile) return 5;
    if (isTablet) return 10;
    return 20;
  };

  return {
    // Breakpoints individuais
    xs,
    sm,
    md,
    lg,
    xl,

    // Grupos lógicos
    isMobile,
    isTablet,
    isDesktop,

    // Específicos
    isSmallMobile,
    isLargeMobile,
    isTabletPortrait,
    isTabletLandscape,

    // Breakpoint atual
    currentBreakpoint,

    // Helpers
    getGridColumns,
    getCardSize,
    getPagePadding,
    shouldCollapseSidebar,
    getTablePageSize,

    // Theme para casos avançados
    theme,
  };
};

export default useBreakpoint;
