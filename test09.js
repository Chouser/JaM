// define a macro called defTestMacro that looks like a function call
JaM.defTestMacro( function( intree ) {
  if( intree[ 0 ] && intree[ 0 ].value == 'defTestMacro' ) {
    intree.shift(); // "defTestMacro"
    var arglist = intree.shift();
    var curlyblock = intree.shift();

    var param = arglist[ 1 ][ 0 ][ 0 ];
    var test = arglist[ 1 ][ 1 ];
    var block = curlyblock[ 1 ];
    intree.unshift( {{
      JaM.defTestMacro( function( #param ) {
        if( #test ) {
          #block
          return true;
        }
        return false;
      });
    }} );
    return true;
  }
  return false;
});

defTestMacro( intree, intree[ 0 ] && intree[ 0 ].value == 'rubyDef' ) {
  intree.shift(); // rubyDef
  var rubyfuncname = intree.shift();
  var argparens = intree.shift();
  var curlybody = intree.shift();

  //var stringname = JaM.it( '(string)', "'" + rubyfuncname.value + "'" );
  var arglist = argparens[1];

  var rubyfunc = JaM.genSym();

  intree.unshift( {{
    function #rubyfunc( yield, #arglist )
      #curlybody
  }} );

  defTestMacro( ctree, ctree[ 0 ] && ctree[ 0 ].value == rubyfuncname.value ) {
    ctree.shift(); // rubyfuncname
    var argparens = ctree.shift();
    var curlybody = ctree.shift();

    var caargs = argparens[1];
    var cbody = curlybody[1];
    var cfargs = cbody[ 0 ].shift();

    ctree.unshift( {{
      #rubyfunc(
        function #cfargs {
          #cbody
        },
        #caargs
      );
    }} );
  }
}


/*
function rubyfunc( yield, ary ) {
  for( var i = 0; i < ary.length; ++i ) {
    yield( ary[ i ], i );
  }
}
*/

rubyDef eachArrayElement( ary ) {
  for( var i = 0; i < ary.length; ++i ) {
    yield( ary[ i ], i );
  }
}


/*
rubyfunc(
  function( v, k ) {
    JaM.msg( k + ": " + v );
  },
  [ 'a', 'b', 'c', 'd' ]
);
*/

eachArrayElement( [ 'a', 'b', 'c', 'd' ] ) { ( v, k )
  JaM.msg( k + ": " + v );
}

eachArrayElement( [ 'foo', 'bar' ] ) { ( name, num )
  JaM.msg( name + " is number " + num );
}



