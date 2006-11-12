JaM.defTestMacro( function( intree ) {
  if( intree[ 0 ] && intree[ 0 ].value == 'unless' ) {
    console.log( '%o', JaM.strtree( intree ) );
    intree.shift(); // "unless"
    var expr = intree.shift();
    intree.unshift(
      JaM.it( '(identifier)', 'if' ),
      JaM.it( '(identifier)', '(' ),
      JaM.it( '(identifier)', '!' ),
      expr,
      JaM.it( '(identifier)', ')' ) );
    console.log( '%o', JaM.strtree( intree ) );
    return true;
  }
  return false;
});

unless( false ) {
  JaM.msg( 'hi' );
}
