// define a macro "defTestMacro" to make it easier to define test
// macros
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

// now use the above macro to define "unless"
// note that the parameters below aren't evaluated now, but instead
// more like the parameters to "for", they are evaluated repeatedly to
// compare against later parts of the syntax tree.
defTestMacro( intree, intree[ 0 ] && intree[ 0 ].value == 'unless' ) {
  console.log( 'unless input: %o', JaM.strtree( intree ) );
  intree.shift(); // "unless"
  var expr = intree.shift();
  intree.unshift( {{
    if( ! #expr )
  }} );
  console.log( 'unless output: %o', JaM.strtree( intree ) );
}

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
