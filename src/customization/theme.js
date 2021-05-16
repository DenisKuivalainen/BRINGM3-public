import { createMuiTheme } from '@material-ui/core/styles';
import pallets from './pallete.json';
import { viewOnPath } from 'ramda-godlike';

// Create a theme instance.
const theme = ({theme, pallete}) => {
  const checkArg = (arg) => !!arg ? parseInt(arg) : 0;

  theme = checkArg(theme); // 0 stands for light
  pallete = checkArg(pallete); // 0 stands for default theme

  let type = theme ? "dark" : "light";

  let color = (n) => {
    let c = viewOnPath([pallete, type, n], pallets);
    return !!c ? c : viewOnPath([0, type, n], pallets);
  }
  // COLOR: [p.main, s.main, p.text, s.text, error, [bg, paper]]

  return createMuiTheme({
    palette: {
      type: type,
      primary: {
        main: color(0),
        contrastText: color(2)
      },
      secondary: {
        main: color(1),
        contrastText: color(3)
      },
      error: {
        main: color(4),
      },
      background: {
        paper: color(6),
        default: color(5)
      },
    }
  });
}

export default theme;
