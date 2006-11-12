JaM.defTestMacro( function( intree ) {
  if( intree[ 0 ] && intree[ 0 ].value == 'unless' ) {
    console.log( 'unless input: %o', JaM.strtree( intree ) );
    intree.shift(); // "unless"
    var expr = intree.shift();
    intree.unshift( {{
      if( ! #expr )
    }} );
    console.log( 'unless output: %o', JaM.strtree( intree ) );
    return true;
  }
  return false;
});

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
