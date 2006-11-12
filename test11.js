// define a macro called defTestMacro that looks like a function call
JaM.defTestMacro( function( intree ) {
  if( intree[ 0 ] && intree[ 0 ].value == 'defTestMacro' ) {
    intree.shift(); // "defTestMacro"
    var arglist = intree.shift();
    var curlyblock = intree.shift();

    var param = arglist[ 1 ][ 0 ][ 0 ];
    var test = arglist[ 1 ][ 1 ];

    // Have to strip trailing comma. Ugh.
    if( test[ test.length - 1 ].value == ',' ) {
      test = test.splice( 0, test.length - 1 );
    }

    var testarg = arglist[ 1 ].length > 2 ? arglist[ 1 ][ 2 ] : JaM.genSym();
    var block = curlyblock[ 1 ];
    intree.unshift( {{
      JaM.defTestMacro( function( #param ) {
        var #testarg = ( #test );
        if( #testarg ) {
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


/*
defTestMacro(
    intree,
    JaM.treeMatch( intree, {{ unless( @*arg ) { @*body } }}[ 0 ] ),
    matchval )
{
  intree.splice(0);
  intree.unshift( {{ if( ! ( #(matchval.arg) ) ) { #(matchval.body) } }} );
}

defTestMacro(
    intree,
    JaM.treeMatch( intree, {{ unless( @*arg ) { @*body } }}[ 0 ] ),
    matchval )
{
  intree.splice(0);
  intree.unshift(
    (
      function( arg, body ) {
        return {{ if( ! ( #arg ) ) { #body } }}
      }
    )( matchval.arg, matchval.body )
  );
}

unless( 1 == 0 ) {
  JaM.msg( 'SEE ME' );
}

unless( 0 == 0 ) {
  JaM.msg( 'NO SEE ME' );
}
*/

defTestMacro(
    intree,
    JaM.treeMatch( intree, {{ defMatchMacro( @*ptn ) { @*body } }}[ 0 ] ),
    matchval )
{
  var ctree = JaM.genSym();
  var cmatch = JaM.genSym();

  var keys = JaM.collectAtSym( matchval.ptn );
  var cmatchkeys = JaM.delimit( {{ , }}, keys );
  var cmatchvals = [];
  for( var i = 0; i < cmatchkeys.length; ++i ) {
    cmatchvals.push( {{ #cmatch . }}[ 0 ].concat( cmatchkeys[ i ] ) );
  }

  //var dbobj = JaM.storeTree( matchval.ptn );

  //console.log( 'matchmacro ptn: %o, %o', dbobj, JaM.strtree( matchval.ptn ) );
  console.log( 'matchmacro ptn: %o', JaM.strtree( matchval.ptn ) );
  console.log( 'cmatchkeys: %o', JaM.strtree( cmatchkeys ) );
  console.log( 'cmatchvals: %o', JaM.strtree( cmatchvals ) );

  intree.splice(0);
  intree.unshift( {{
    defTestMacro(
      #ctree, JaM.treeMatch( #ctree, {{ #(matchval.ptn) }}[0][0][0] ), #cmatch )
    {
      #ctree.splice(0);
      #ctree.unshift(
        (
          function(#cmatchkeys) {
            #(matchval.body)
          }
        )(#cmatchvals)
      );
    }
  }} );
}

/*
defMatchMacro( unless( @*arg ) { @*body } ) {
  return {{ if( ! ( #arg ) ) { #body } }};
}

unless( 1 == 0 ) {
  JaM.msg( 'SEE' + ' ME' );
}

unless( 0 == 0 ) {
  JaM.msg( 'NO SEE ME' );
}
*/

// This defines a keyword "rubyDef" that allows you to define
// ruby-like functions that take a code block.
defMatchMacro( rubyDef @rubyfuncname( @*arglist ) { @*curlybody } ) {
  var rubyfunc = JaM.genSym();

  defMatchMacro( #rubyfuncname( @*caargs ) { ( @*cfargs ); @*cbody } ) {
    return {{
      #rubyfunc(
        function( #cfargs ) {
          #cbody
        },
        #caargs
      )
    }};
  }

  return {{
    window.#rubyfunc = function( yield, #arglist ) {
      #curlybody
    }
  }};
}

// Here are a couple of ruby-like functions defined using the above macro.
rubyDef eachArrayElement( ary ) {
  for( var i = 0; i < ary.length; ++i ) {
    yield( ary[ i ], i );
  }
}

rubyDef evensTo( max ) {
  for( var i = 0; i <= max; i += 2 ) {
    yield( i );
  }
}

// Here are a few uses of the above ruby-like functions.
eachArrayElement( [ 'a', 'b', 'c', 'd' ] ) { ( v, k );
  JaM.msg( k + ': ' + v );
}

eachArrayElement( [ 'foo', 'bar' ] ) { ( name, num );
  JaM.msg( name + " is number " + num );
}

evensTo( 4 ) { ( i );
  evensTo( 6 ) { ( j );
    JaM.msg( "even pairs: " + i + ", " + j );
  }
}
