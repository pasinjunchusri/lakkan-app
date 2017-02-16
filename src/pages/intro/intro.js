import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  'page-intro ion-slide': {
    'display': 'flex',
    'justifyContent': 'center'
  },
  'page-intro ion-slide button': {
    'boxShadow': [{ 'unit': 'px', 'value': 2 }, { 'unit': 'px', 'value': 2 }, { 'unit': 'px', 'value': 2 }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.2)' }]
  },
  'page-intro ion-slide slide-zoom': {
    'display': 'flex',
    'width': [{ 'unit': '%H', 'value': 1 }],
    'textAlign': 'center',
    'height': [{ 'unit': '%V', 'value': 1 }],
    'flexDirection': 'column'
  },
  'page-intro ion-slide view-welcome': {
    'display': 'flex',
    'flex': '4',
    'flexDirection': 'column',
    'alignItems': 'center',
    'justifyContent': 'center'
  },
  'page-intro ion-slide view-welcome logo': {
    'maxWidth': [{ 'unit': '%H', 'value': 0.6 }],
    'background': 'transparent',
    'marginBottom': [{ 'unit': 'px', 'value': 40 }]
  },
  'page-intro ion-slide phone': {
    'display': 'flex',
    'justifyContent': 'center'
  },
  'page-intro ion-slide text-content': {
    'display': 'flex',
    'justifyContent': 'center'
  },
  'page-intro ion-slide phone': {
    'flex': '4',
    'alignItems': 'flex-end',
    'overflow': 'hidden'
  },
  'page-intro ion-slide text-content': {
    'flex': '1',
    'flexDirection': 'column',
    'alignItems': 'center',
    'color': '#fff',
    'padding': [{ 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 10 }],
    'textShadow': [{ 'unit': 'px', 'value': 2 }, { 'unit': 'px', 'value': 2 }, { 'unit': 'px', 'value': 2 }, { 'unit': 'string', 'value': 'rgba(0, 0, 0, 0.2)' }],
    // Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#fbda61+0,f7781c+100
    'background': '#fbda61',
    // Old browsers
    'background': '-moz-linear-gradient(top, #fbda61 0%, #f7781c 100%)',
    // FF3.6-15
    'background': '-webkit-linear-gradient(top, #fbda61 0%, #f7781c 100%)',
    // Chrome10-25,Safari5.1-6
    'background': 'linear-gradient(to bottom, #fbda61 0%, #f7781c 100%)',
    // W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+
    'filter': 'progid:DXImageTransform.Microsoft.gradient(startColorstr='#fbda61', endColorstr='#f7781c', GradientType=0)',
    // IE6-9
  },
  'page-intro ion-slide text-content h1': {
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }]
  },
  'page-intro ion-slide text-content p': {
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }]
  },
  'page-intro toolbar-background': {
    'background': '#fff',
    'borderColor': 'transparent'
  },
  'page-intro phone': {
    'position': 'relative',
    'width': [{ 'unit': '%H', 'value': 0.8 }],
    'height': [{ 'unit': 'px', 'value': 736 }],
    'maxWidth': [{ 'unit': 'px', 'value': 414 }],
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }],
    'marginTop': [{ 'unit': '%V', 'value': 0.1 }]
  },
  'page-intro phoneiphone': {
    'backgroundImage': 'url(../assets/img/devices/iphone.png)',
    'backgroundRepeat': 'no-repeat',
    'backgroundSize': 'cover',
    'width': [{ 'unit': '%H', 'value': 0.8 }],
    'maxWidth': [{ 'unit': 'px', 'value': 407 }],
    'minWidth': [{ 'unit': 'px', 'value': 270 }]
  },
  'page-intro phoneiphone img': {
    'display': 'block',
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }],
    'position': 'relative',
    'width': [{ 'unit': '%H', 'value': 0.79 }],
    'top': [{ 'unit': 'px', 'value': 30 }]
  },
  'page-intro phoneandroid': {
    'backgroundImage': 'url(../assets/img/devices/android.png)',
    'backgroundRepeat': 'no-repeat',
    'backgroundSize': 'cover',
    'width': [{ 'unit': '%H', 'value': 0.9 }],
    'maxWidth': [{ 'unit': 'px', 'value': 340 }],
    'minWidth': [{ 'unit': 'px', 'value': 290 }]
  },
  'page-intro phoneandroid img': {
    'display': 'flex',
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }, { 'unit': 'px', 'value': 0 }, { 'unit': 'string', 'value': 'auto' }],
    'position': 'absolute',
    'width': [{ 'unit': '%H', 'value': 0.83 }],
    'top': [{ 'unit': 'px', 'value': 74 }],
    'maxHeight': [{ 'unit': 'string', 'value': 'none' }]
  },
  'page-intro swiper-pagination-progress swiper-pagination-progressbar': {
    'background': 'rgba(0, 0, 0, 0.1)'
  }
});
