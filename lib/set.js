var isArray = Array.isArray || function (obj) {
  return !!(obj && obj.concat && obj.unshift && !obj.callee);
};

function Set (members, opts) {
  this._members = {};
  this.length = 0;

  opts = opts || {};
  if (arguments.length === 1 && !isArray(arguments[0])) {
    opts = members;
    members = [];
  }
  if (opts.hashBy) this.hashBy = opts.hashBy;
  if (members) this.madd(members);
}

Set.prototype = {
  contains: function (member, opts) {
    var key = this._hash(member, opts && opts.hashBy);
    return !!this._members[key];
  },
  add: function (member, opts) {
    if (this.contains(member, opts)) return false;
    var key = this._hash(member, opts && opts.hashBy);
    this._members[key] = (opts && opts.hashBy) ? member : true;
    this.length++;
    return true;
  },
  madd: function (members, opts) {
    var i = members.length
      , numAdded = 0;
    while (i--) {
      numAdded += this.add(members[i], opts) ? 1 : 0;
    }
    return numAdded;
  },
  remove: function (member, opts) {
    if (!this.contains(member, opts)) return false;
    var key = this._hash(member, opts && opts.hashBy);
    delete this._members[key];
    this.length--;
    return true;
  },
  mremove: function (members, opts) {
    var i = members.length
      , numRemoved = 0;
    while (i--) {
      numRemoved += this.remove(members[i], opts) ? 1 : 0;
    }
    return numRemoved;
  },
  clear: function () {
    this._members = {};
    this.length = 0;
  },
  forEach: function (block, context) {
    var k, members = this._members;
    for (k in members) {
      block.call(context, typeof members[k] === "boolean" ? k : members[k]);
    }
  },
  _hash: function (member, hashBy) {
    switch (typeof hashBy || this.hashBy) {
      case 'string': return member[hashBy];
      case 'function': return hashBy(member);
      default: return member;
    }
  }
};

module.exports = Set;