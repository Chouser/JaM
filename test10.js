// shortcut:
var treeMatch = JaM.treeMatch;

JaM.msg( "should match: " + treeMatch({{ a( b, c ) }}, {{ a( b, c ) }} ) );
JaM.msg( "should NOT match: " + treeMatch({{ a( b ) }}, {{ a( b, c ) }} ) );

JaM.msg( "should match: q = " + treeMatch({{ a( b, c ) }}, {{ a( @q, c ) }} ).q.value );
JaM.msg( "should NOT match: " + treeMatch({{ a( b, c ) }}, {{ a( @b ) }} ) );
JaM.msg( "should NOT match: " + treeMatch({{ a( b, c ) }}, {{ a( @b, q ) }} ) );

JaM.msg( "should match: " + treeMatch(
  {{
    def a( b, c ) {
      foo;
      bar;
    }
  }},
  {{
    def @name( @arg1, @arg2 ) {
      @body1;
      @body2;
    }
  }} ) );

JaM.msg( "should match: " + treeMatch(
  {{
    def a( b, c, d ) {
      foo;
      bar;
    }
  }},
  {{
    def @name( @arg1, @*args ) {
      @*body
    }
  }} ) );

JaM.msg( "should match: " + treeMatch(
  {{
    foo( a, b ) { ( c, d ); e; f; }
  }},
  {{
    foo( @*caargs ) { ( @*cfargs ); @*cbody }
  }} ) );
