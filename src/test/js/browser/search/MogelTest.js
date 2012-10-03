test(
  'MogelTest',

  [
    'ephox.compass.Arr',
    'ephox.phoenix.search.Mogel',
    'ephox.phoenix.wrap.Wrapper',
    'ephox.phoenix.wrap.Wraps',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Html',
    'ephox.sugar.api.Insert',
    'ephox.sugar.api.InsertAll',
    'ephox.sugar.api.Remove'
  ],

  function (Arr, Mogel, Wrapper, Wraps, Attr, Element, Html, Insert, InsertAll, Remove) {
    
    var text = Element.fromText('Sed ut perspiciatis unde omnis iste natus error sit voluptatem');
    var body = Element.fromDom(document.body);
    var container = Element.fromTag('div');
    Insert.append(body, container);

    var check = function (expected, rawTexts, words) {
      var elements = Arr.map(rawTexts, function (x) {
        return Element.fromText(x);
      });

      Remove.empty(container);
      InsertAll.append(container, elements);

      console.log('initially: ', Html.get(container));
      var snapshots = Mogel.mogel(elements, words);

      Arr.each(snapshots, function (x) {
        Wrapper.wrapper(x.elements(), function () {
          var span = Element.fromTag('span');
          Attr.set(span, 'data-word', x.word());
          return Wraps.basic(span);
        });
      });

      assert.eq(expected, Html.get(container));
    };

    // check('<span data-word="Sed">Sed</span>', ['Sed'], ['Sed']);
    check('<span data-word="Sed">Sed</span> ut perspiciatis <span data-word="unde">u</span><span data-word="unde">nde</span>' +
      ' omnis <span data-word="iste">iste</span> natus error <span data-word="sit">sit</span> voluptatem', ['Sed', ' ut per', 'spiciatis u', 'nde om', 'ni', 's iste', ' natus', ' error', ' sit voluptatem'], ['Sed', 'iste', 'unde', 'sit']);
    // check('<span data-word="Sed">Sed</span> <span>ut</span>', ['Sed', ' ut per'], ['Sed', 'ut']);
  }
);
