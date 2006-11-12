/* this may be misguided and thus should be dumped...
 *

// a new more flexible version of "defMacro"
defTestMacro( intree, intree[ 0 ] && intree[ 0 ].value == 'defMacro' ) {
  intree.shift(); // defMacro
  var macroname = intree.shift();
  var argparens = intree.shift();
  var curlybody = intree.shift();

  var stringname = JaM.it( '(string)', "'" + macroname.value + "'" );
  var arglist = argparens[1];
  var body = curlybody[1];
  //console.log( "arglist: %o", JaM.strtree( arglist ) );
  //console.log( "body after: %o", JaM.strtree( body ) );

  var mtree = JaM.genSym();
  var margparens = JaM.genSym();

  var collectparams = [];
  var argname;
  for( var i = 0; i < arglist.length; ++i ) {
    if( arglist[ i ][ 0 ].value == 'block' && arglist[ i ][ 1 ].value == ':' ) {
      argname = arglist[ i ][ 2 ];
      collectparams.push( {{
        var #argname = (#mtree.shift())[ 1 ];
      }} );
    }
    else {
      argname = arglist[ i ][ 0 ];
      collectparams.push( {{
        var #argname = #margparens[1].shift();
      }} );
    }
  }

  intree.unshift( {{
    defTestMacro( #mtree, #mtree[ 0 ] && #mtree[ 0 ].value == #stringname ) {
      #mtree.shift(); // macroname
      var #margparens = #mtree.shift();
      #collectparams

      #mtree.unshift(
        (function(){
          #body
        })()
      );
    }
  }} );
}
*/

