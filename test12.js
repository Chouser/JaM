JaM.defTestMacro( function( intree ) {
  if( intree[ 0 ] && intree[ 0 ].value == 'comment' ) {
    intree.shift(); // consume the word "comment"
    intree.shift(); // consume the next token branch
    return true;
  }
  return false;
});

JaM.msg( 'see this' );
comment( JaM.msg( 'skip this' ) );
JaM.msg( 'see this too' );
