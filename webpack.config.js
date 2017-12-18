
var path              = require('path');
var webpack           = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

//环境变量
var WEBPACK_EVN       =process.env.WEBPACK_EVN || 'dev';
// 封装的获取 html-webpack-plugin 参数的方法
var getHtmlConfig     = function(name){
  return{
    filename: 'view/'+name+'.html',
    template: './src/view/'+name+'.html',
    inject  : true,
    hash    : true,
    chunks  : ['common',name]

  }
    
}
var config  = {
  // entry 是一个单入口,以下面对象形式可以设置为多入口.webpack1.15.0版本需要给路径加'[]'
  entry: {
    //假设我们想让此模块作为全局模块,并且加载到base.js中,可在下面plugins中的 name: 设置为此模块的名字,并且不会影响引用的其他模块,如moudle.js
    common:['./src/page/common/index'], 
    index: ['./src/page/index/index'],
    login: ['./src/page/login/index']
  },
  // output 是输出口
  output: {
    //path 是 nodeJS 的一个基础模块，这里用来获取绝对路径 保存路径
    path: path.resolve(__dirname, 'dist'),
    // 访问的路径
    publicPath: '/dist',
    // 'js/[name].js' 生成对应的存放于'js'目录下的打包文件,[name]是一个变量
    filename: 'js/[name].js'
  },
  externals: {
    'jquery': 'window.jQuery'
  },
  module:{
    loaders:[
      // 处理css的loader
      { test: /\.css$/,  loader:  ExtractTextPlugin.extract("style-loader","css-loader")},
      // 处理图片的loader   limit 是限制文件的大小,小于limit会将图片转化为base64,大于limit会以文件形式存在  &name=resource/[name].[ext] 将打包出来的图片放进对应目录
      { test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,  loader: 'url-loader?limit=100&name=resource/[name].[ext]'}
    ]// woff|svg|eot|ttf 是需要的字体文件 同样用 url-loader打包
  },
  //独立通用模块
  plugins:[
        //此处用到了'webpack',但我们并没有这个变量,所以需要require
    new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        // output中配置了输出的根目录,所以后面的路径都设置在 dist目录下
        filename : 'js/base.js'
    }),
    //把css单独打包
    new ExtractTextPlugin("css/[name].css"), 
    //html 模板处理
    new HtmlWebpackPlugin(getHtmlConfig('index')),
    new HtmlWebpackPlugin(getHtmlConfig('login'))
  ]

  
} ;
if('dev'===WEBPACK_EVN){
   config.entry.common.push('webpack-dev-server/client?http://localhost:8088/')
}
module.exports = config