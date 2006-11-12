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

// define a macro "defMacro" that looks like a function declaration
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

// Our simplest-looking "unless" macro yet, using "defMacro" defined above
defMacro unless( expr, block: body ) {
  return {{
    if( ! ( #expr ) ) {
      #body
    }
  }};
}

// Try out our new "unless" macro
unless( false ) {
  JaM.msg( 'hi' ); // should see this
}

unless( 5 + 10 ) {
  JaM.msg( 'not' ); // should NOT see this
}

unless( 5 * 2 - 10 ) {
  var i = 1;
  JaM.msg( 'there' ); // see this too
}
