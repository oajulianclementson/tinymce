define(
  'ephox.phoenix.util.arr.PositionArray',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option'
  ],

  function (Arr, Fun, Option) {

    var make = function (xs, f) {

      var init = {
        len: 0,
        list: []
      };

      var r = Arr.foldl(xs, function (b, a) {
        var value = f(a, b.len);
        return value.fold(Fun.constant(b), function (v) {
          return {
            len: v.finish(),
            list: b.list.concat([v])
          };
        });
      }, init);

      return r.list;
    };

    var getAt = function (list, count) {
      var item = Arr.find(list, function (x) {
        return x.start() <= count && x.finish() >= count;
      });

      return Option.from(item);
    };

    var splitAt = function (list, start, finish, first, last) {
      return Arr.foldr(list, function (b, a) {
        if (start >= a.start() && start <= a.finish()) {
          var rest = first(start, a);
          var after = rest[rest.length - 1];
          if (finish >= after.start() && finish  <= after.finish()) {
            var before = rest.length > 1 ? [rest[0]] : [];
            return before.concat(last(finish, after)).concat(b);
          } else {
            return rest.concat(b);
          }
          return first(start, a).concat(b);
        } else if (finish >= a.start() && finish <= a.finish()) {
          return last(finish, a).concat(b);
        } else {
          return [a].concat(b);
        }
      }, []);
    };

    var sub = function (list, start, finish) {

      var first = Arr.findIndex(list, function (x) {
        return x.start() === start;
      });

      var last = Arr.findIndex(list, function (x) {
        return x.start() === finish;
      });

      return first > -1 && last >- 1 ? list.slice(first, last) :
        list[list.length - 1] && list[list.length - 1].finish() === finish && first >- 1 ? list.slice(first) : [];

      // if (start > finish) throw 'Start must be lower than finish. ' + start + ' > ' + finish;
      // var r = Arr.foldr(list, function (b, a) {
      //   if (a.start() === start) {
      //     return { done: b.done, started: true, v: [a].concat(b.v) };
      //   } else if (a.start() === finish) {
      //     return { done: true, v: [a] };
      //   } else {
      //     return { done: b.done, started: b.started, v: b.v };
      //   }
      // }, { done: false, started: false, v: []});

      // return r.done && r.started ? r.v :
      //   r.started && list[list.length - 1] && list[list.length - 1].finish() === finish ? r.v : [];
    };

    return {
      make: make,
      getAt: getAt,
      splitAt: splitAt,
      sub: sub
    };
  }
);
