import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  'image-capture': {
    'display': 'flex',
    'position': 'relative',
    'alignItems': 'center',
    'flexDirection': 'row',
    'flex': '1',
    'paddingBottom': [{ 'unit': 'px', 'value': 25 }]
  },
  'image-capture ion-avatar': {
    'display': 'flex',
    'lineHeight': [{ 'unit': 'px', 'value': 1 }],
    'flex': '1',
    'flexDirection': 'column',
    'alignItems': 'center',
    'marginTop': [{ 'unit': 'px', 'value': 20 }]
  },
  'image-capture ion-avatar img': {
    'display': 'block',
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }],
    'height': [{ 'unit': 'px', 'value': 100 }],
    'width': [{ 'unit': 'px', 'value': 100 }],
    'maxHeight': [{ 'unit': 'px', 'value': 100 }],
    'maxWidth': [{ 'unit': 'px', 'value': 100 }],
    'borderRadius': '50%'
  },
  'image-capture ion-avatar p': {
    'textAlign': 'center',
    'lineHeight': [{ 'unit': 'em', 'value': 3 }],
    'color': '#000',
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }]
  },
  'image-capture button': {
    'borderRadius': '50% !important',
    'position': 'absolute',
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }],
    'display': 'block',
    'top': [{ 'unit': 'px', 'value': 20 }],
    'left': [{ 'unit': '%H', 'value': 0.55 }],
    'border': [{ 'unit': 'px', 'value': 2 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': '#fff' }],
    'width': [{ 'unit': 'px', 'value': 35 }],
    'height': [{ 'unit': 'px', 'value': 35 }]
  }
});
