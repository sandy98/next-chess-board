'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _uuid = require('uuid');

var _chess = require('chess.js');

var _chess2 = _interopRequireDefault(_chess);

var _chessSets = require('./chess-sets');

var _chessSets2 = _interopRequireDefault(_chessSets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var steimberg = 155978933;

var ChessBoard = function (_Component) {
  (0, _inherits3.default)(ChessBoard, _Component);

  /* End of general functions */

  /*
  const unflippedRows = [ChessBoard.range(56), ChessBoard.range(48), ChessBoard.range(40), ChessBoard.range(32), ChessBoard.range(24), ChessBoard.range(16), ChessBoard.range(8), ChessBoard.range()]
  const flippedRows = [ChessBoard.range(7, -1), ChessBoard.range(15, 7), ChessBoard.range(23, 15), ChessBoard.range(31, 23), 
                      ChessBoard.range(39, 31), ChessBoard.range(47, 39), ChessBoard.range(55, 47), ChessBoard.range(63, 55)]
  */

  function ChessBoard(props) {
    (0, _classCallCheck3.default)(this, ChessBoard);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ChessBoard.__proto__ || (0, _getPrototypeOf2.default)(ChessBoard)).call(this, props));

    _this.drawDiagram = function (context) {
      var ctxSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.state.size;

      var x = void 0,
          y = void 0,
          xx = void 0,
          yy = void 0,
          img = void 0;
      var arr = _this.figuresCurrent();
      var sqSize = ctxSize / 8;

      for (y = 0; y < 4; y++) {
        for (x = 0; x < 4; x++) {
          xx = x * (sqSize * 2);
          yy = y * (sqSize * 2);
          context.fillStyle = _this.state.lightSqsBg;
          context.fillRect(xx, yy, xx + sqSize, yy + sqSize);

          xx = x * (sqSize * 2) + sqSize;
          context.fillStyle = _this.state.darkSqsBg;
          context.fillRect(xx, yy, xx + sqSize, yy + sqSize);
        }

        for (x = 0; x < 4; x++) {
          xx = x * (sqSize * 2);
          yy = y * (sqSize * 2) + sqSize;
          context.fillStyle = _this.state.darkSqsBg;
          context.fillRect(xx, yy, xx + sqSize, yy + sqSize);

          xx = x * (sqSize * 2) + sqSize;
          context.fillStyle = _this.state.lightSqsBg;
          context.fillRect(xx, yy, xx + sqSize, yy + sqSize);
        }
      }

      // console.log(arr)

      for (var i = 0; i < 64; i++) {
        if (arr[i] !== '0') {
          img = new Image();
          img.src = ChessBoard.chessSets[_this.state.chessSet][arr[i]];
          var ci = _this.state.flipped ? i ^ 63 ^ 56 : i ^ 56;
          yy = ChessBoard.row(ci ^ 56) * sqSize;
          xx = ChessBoard.col(ci ^ 56) * sqSize;
          context.drawImage(img, xx, yy, sqSize, sqSize);
        }
      }

      return "Done";
    };

    _this.on = function (evt, cb) {
      var uuid = (0, _uuid.v4)();
      _this.subscribers = [].concat((0, _toConsumableArray3.default)(_this.subscribers), [{ id: uuid, event: evt, callback: cb }]);
      return function () {
        return _this.subscribers = _this.subscribers.filter(function (subscriber) {
          return subscriber.id !== uuid;
        });
      };
    };

    _this.emit = function (evt) {
      for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        data[_key - 1] = arguments[_key];
      }

      return _this.subscribers.filter(function (subscriber) {
        return subscriber.event === evt;
      }).forEach(function (subscriber) {
        return subscriber.callback.apply(subscriber, data);
      });
    };

    _this.doScroll = function () {
      return _this.refs.notation.scrollTop = _this.refs.notation.scrollHeight;
    };

    _this.useSet = function (set) {
      return _this.setState({ chessSet: set });
    };

    _this.useSquares = function (n) {
      return _this.setState({ lightSqsBg: ChessBoard.lightSqBgs[n], darkSqsBg: ChessBoard.darkSqBgs[n] });
    };

    _this.goto = function (n) {
      var n1 = void 0;
      if (n >= _this.state.positions.length) {
        n1 = _this.state.positions.length - 1;
      } else if (n < 0) {
        n1 = 0;
      } else {
        n1 = n;
      }
      _this.setState({ currentPosition: n1 });
      _this.emit(ChessBoard.Events.CHANGE, n1);
    };

    _this.previous = function () {
      return _this.goto(_this.state.currentPosition - 1);
    };

    _this.next = function () {
      return _this.goto(_this.state.currentPosition + 1);
    };

    _this.last = function () {
      return _this.goto(_this.state.positions.length - 1);
    };

    _this.first = function () {
      return _this.goto(0);
    };

    _this.empty = function () {
      if (_this.props.moveValidator) {
        _this.game.load(ChessBoard.emptyFen);
      }
      _this.setState({ positions: [ChessBoard.emptyFen],
        currentPosition: 0, movements: [] });
    };

    _this.resetBaseHeaders = function () {
      _this.setState({ whitePlayer: _this.props.whitePlayer || ChessBoard.defaultSettings.whitePlayer,
        blackPlayer: _this.props.blackPlayer || ChessBoard.defaultSettings.blackPlayer,
        gameDate: ChessBoard.date2pgn(new Date()) });
    };

    _this.setBaseHeaders = function () {
      if (!_this.props.moveValidator) return;
      _this.game.header('White', _this.state.whitePlayer, 'Black', _this.state.blackPlayer, 'Date', _this.state.gameDate);
    };

    _this.reset = function () {
      _this.resetBaseHeaders();
      if (_this.props.moveValidator) {
        _this.game.reset();
        _this.setBaseHeaders();
      }
      _this.setState({ positions: [ChessBoard.defaultFen],
        currentPosition: 0, movements: [] });
      _this.emit(ChessBoard.Events.CHANGE, 0);
      return true;
    };

    _this.loadFen = function (fen) {
      var result = true;
      if (_this.props.moveValidator) {
        result = _this.game.load(fen);
      }
      if (result) {
        _this.setState({ positions: [fen], currentPosition: 0, movements: [] });
        _this.resetBaseHeaders();
        _this.setBaseHeaders();
        _this.emit(ChessBoard.Events.CHANGE, 0);
      } else {
        _this.emit(ChessBoard.Events.ERROR, ChessBoard.Messages.ERROR_LOAD_FEN, '');
      }

      return result;
    };

    _this.loadPgn = function (pgn) {
      if (!_this.props.moveValidator) return false;
      var isGood = _this.game.load_pgn(pgn);
      if (isGood) {
        var gameData = _this.game.header();
        _this.setState({ positions: _this.game.fens(),
          currentPosition: 0,
          movements: _this.game.history(),
          whitePlayer: gameData.White,
          blackPlayer: gameData.Black,
          gameDate: gameData.Date,
          gameResult: gameData.Result });
        _this.emit(ChessBoard.Events.CHANGE, 0);
      }
      return isGood;
    };

    _this.takeback = function () {
      if (_this.state.positions.length === 1) return false;
      if (_this.props.moveValidator) _this.game.undo();
      var posics = _this.props.moveValidator ? _this.game.fens() : _this.state.positions.slice(0, _this.state.positions.length - 1);
      _this.setState({ positions: posics,
        currentPosition: posics.length - 1,
        movements: _this.props.moveValidator ? _this.game.history() : _this.state.movements.slice(0, _this.state.movements.length - 1)
      });
      _this.emit(ChessBoard.Events.CHANGE, posics.length - 1);
      return true;
    };

    _this.san2fig = function (san) {
      var csan = san.replace(/[NBRQK]/, function (f) {
        return _this.game.turn() == 'w' ? f.toLowerCase() : f;
      });
      return csan.replace(/[NBRQKnbrqk]/, function (l) {
        return ChessBoard.Figurines[l].html;
      });
    };

    _this.isFlipped = function () {
      return _this.state.flipped;
    };

    _this.paramFromPosition = function (npos, nparam) {
      return _this.state.positions[npos].split(/\s+/)[nparam];
    };

    _this.figuresFromPosition = function (npos) {
      return ChessBoard.expandPosition(_this.state.positions[npos].split(/\s+/)[0]);
    };

    _this.whoMovesFromPosition = function (npos) {
      return _this.state.positions[npos].split(/\s+/)[1];
    };

    _this.castlingFromPosition = function (npos) {
      return _this.state.positions[npos].split(/\s+/)[2];
    };

    _this.enPassantFromPosition = function (npos) {
      return _this.state.positions[npos].split(/\s+/)[3];
    };

    _this.halfMoveClockFromPosition = function (npos) {
      return parseInt(_this.state.positions[npos].split(/\s+/)[4]);
    };

    _this.moveNumberFromPosition = function (npos) {
      return parseInt(_this.state.positions[npos].split(/\s+/)[5]);
    };

    _this.figuresCurrent = function () {
      return _this.figuresFromPosition(_this.state.positions.length - 1);
    };

    _this.whoMovesCurrent = function () {
      return _this.whoMovesFromPosition(_this.state.positions.length - 1);
    };

    _this.castlingCurrent = function () {
      return _this.castlingFromPosition(_this.state.positions.length - 1);
    };

    _this.enPassantCurrent = function () {
      return _this.enPassantFromPosition(_this.state.positions.length - 1);
    };

    _this.halfMoveClockCurrent = function () {
      return _this.halfMoveClockFromPosition(_this.state.positions.length - 1);
    };

    _this.moveNumberCurrent = function () {
      return _this.moveNumberFromPosition(_this.state.positions.length - 1);
    };

    _this.setPlayer = function (color, player) {
      if (color === 'w') {
        _this.setState({ whitePlayer: player });
      } else {
        _this.setState({ blackPlayer: player });
      }
      _this.setBaseHeaders();
    };

    _this.setDate = function (date) {
      _this.setState({ gameDate: ChessBoard.date2pgn(date) });
      _this.setBaseHeaders();
    };

    _this.setSize = function (newSize) {
      _this.setState({ size: newSize });
    };

    _this.flip = function () {
      var newFlipped = !_this.state.flipped;
      _this.setState({ flipped: newFlipped });
      _this.emit(ChessBoard.Events.FLIP, newFlipped);
    };

    _this.setHeader = function (k, v) {
      if (!_this.props.moveValidator) return;
      _this.game.header(k, v);
      var obj = {};
      obj[k] = v;
      _this.setState(obj);
    };

    _this.getPgnText = function () {
      if (!_this.props.moveValidator || !_this.game) return '';
      var annotations = document.getElementsByClassName('annotation');
      var annotation = annotations ? annotations[0] : null;
      var hei = annotation ? annotation.scrollHeight : 200;
      //console.log("Scroll height: ", hei)
      if (annotations && annotations.forEach) {
        annotations.forEach(function (a) {
          return a.scrollTop = hei;
        });
      }
      if (annotation) annotation.scrollTop = hei;
      var headers = _this.game ? _this.game.header() : {};
      var hkeys = [];
      for (var k in headers) {
        hkeys.push(k);
      }var hheaders = hkeys.map(function (ky, i) {
        return _react2.default.createElement('p', { style: { margin: '1pt' }, key: i }, '[', ky, ' "', headers[ky], '"]');
      });
      var sans = _this.game ? _this.game.history() : _this.state.movements;
      var decoSans = sans.map(function (san, ind) {
        return _react2.default.createElement('span', { key: ind + 1,
          style: {
            cursor: 'pointer',
            backgroundColor: ind + 1 === _this.state.currentPosition ? _this.state.lightSqsBg : 'white'
          },
          title: '',
          onClick: function onClick(e) {
            return _this.goto(ind + 1);
          }
        }, _this.state.positions[ind] && _this.state.positions[ind].split(/\s+/)[1] === 'w' ? _this.state.positions[ind].split(/\s+/)[5] + '. ' : ind === 0 ? _this.state.positions[ind].split(/\s+/)[5] + '. ... ' : '', san, '\xA0');
      });
      return _react2.default.createElement('div', { ref: 'annotation', className: 'annotation' }, hheaders, _react2.default.createElement('p', { style: { margin: '1pt' } }, _react2.default.createElement('span', { key: 0,
        style: { cursor: 'pointer',
          backgroundColor: 0 === _this.state.currentPosition ? _this.state.lightSqsBg : 'white'
        },
        onClick: function onClick(e) {
          return _this.goto(0);
        }
      }, '\xA0\xA0\xA0'), decoSans));
    };

    _this.getCrowning = function (sqFrom, sqTo, fig) {
      _this.crowningInfo = { sqFrom: sqFrom,
        sqTo: sqTo,
        figureFrom: fig,
        sqColor: ChessBoard.isBlackSquare(sqTo ^ 56) ? 'b' : 'w',
        figColor: ChessBoard.figureColor(fig),
        top: _this.refs[ChessBoard.sq2san(sqTo ^ 56)].offsetTop,
        left: _this.refs[ChessBoard.sq2san(sqTo ^ 56)].offsetLeft
      };
      _this.setState({ isCrowning: true });
    };

    _this.move = function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (_this.state.currentPosition !== _this.state.positions.length - 1) {
        return _this.emit(ChessBoard.Events.ERROR, ChessBoard.Messages.ERROR_PREV_POS, '');
      }
      var argsLen = args.length;
      if (argsLen === 0 || argsLen === 2) {
        return _this.emit(ChessBoard.Events.ERROR, ChessBoard.Messages.ERROR_MOVE_ARGS, argsLen);
      }
      var sqFrom = args[0],
          sqTo = args[1],
          figure = args[2],
          crowning = args[3];

      if (argsLen > 1 && _this.whoMovesCurrent() !== ChessBoard.figureColor(figure)) {
        return _this.emit(ChessBoard.Events.ERROR, ChessBoard.Messages.ERROR_MOVE_TURN, ChessBoard.figureColor(figure));
      }
      if (!crowning && (figure === 'p' && ChessBoard.row(sqTo ^ 56) === 0 || figure === 'P' && ChessBoard.row(sqTo ^ 56) === 7)) {
        _this.getCrowning(sqFrom, sqTo, figure);
        return;
      }
      if (argsLen === 1 && !_this.props.moveValidator) {
        return _this.emit(ChessBoard.Events.ERROR, ChessBoard.Messages.ERROR_CANT_PROCESS_SAN, '');
      }

      if (!_this.props.moveValidator && argsLen > 1) {
        var oldFigure = void 0;
        if (crowning) {
          var _ref = [figure, crowning];
          oldFigure = _ref[0];
          figure = _ref[1];
        } else {
          oldFigure = figure;
        }
        var newPos = [].concat((0, _toConsumableArray3.default)(_this.figuresCurrent()));
        newPos[sqFrom] = '0';
        newPos[sqTo] = figure;
        if (figure === 'k' && sqFrom === 4 && sqTo === 2) {
          newPos[0] = '0';
          newPos[3] = 'r';
        }
        if (figure === 'k' && sqFrom === 4 && sqTo === 6) {
          newPos[7] = '0';
          newPos[5] = 'r';
        }
        if (figure === 'K' && sqFrom === 60 && sqTo === 58) {
          newPos[56] = '0';
          newPos[59] = 'R';
        }
        if (figure === 'K' && sqFrom === 60 && sqTo === 62) {
          newPos[63] = '0';
          newPos[61] = 'R';
        }

        var newCurrPos = _this.state.positions.length;

        var newComprPos = ChessBoard.compressPosition(newPos.join(''));

        var newWhoMoves = _this.whoMovesCurrent() === 'w' ? 'b' : 'w';

        var oldCastling = _this.castlingCurrent();
        var newCastling = oldCastling;
        if (figure === 'K') newCastling = oldCastling.replace(/K/, '').replace(/Q/, '');
        if (figure === 'k') newCastling = oldCastling.replace(/k/, '').replace(/q/, '');
        if (figure === 'R' && (sqFrom ^ 56) === 0) newCastling = oldCastling.replace(/Q/, '');
        if (figure === 'R' && (sqFrom ^ 56) === 7) newCastling = oldCastling.replace(/K/, '');
        if (figure === 'r' && (sqFrom ^ 56) === 56) newCastling = oldCastling.replace(/q/, '');
        if (figure === 'r' && (sqFrom ^ 56) === 63) newCastling = oldCastling.replace(/k/, '');
        newCastling = newCastling.length === 0 ? '-' : newCastling;

        var newEnPassant = '-';
        if ((figure === 'p' || figure === 'P') && Math.abs(sqTo - sqFrom) === 16) {
          var sumando = figure === 'P' ? 8 : -8;
          newEnPassant = ChessBoard.sq2san(sqTo + sumando ^ 56);
        }

        var newHalfMoveClock = _this.halfMoveClockCurrent() + 1;
        if (figure === 'p' || figure === 'P' || _this.figuresCurrent()[sqTo] !== '0') newHalfMoveClock = 0;

        var newMoveNumber = _this.moveNumberCurrent();
        if (newWhoMoves === 'w') newMoveNumber++;

        _this.setState({ currentPosition: newCurrPos,
          positions: [].concat((0, _toConsumableArray3.default)(_this.state.positions), [[newComprPos, newWhoMoves, newCastling, newEnPassant, newHalfMoveClock, newMoveNumber].join(' ')]),
          movements: [].concat((0, _toConsumableArray3.default)(_this.state.movements), [{ sqFrom: sqFrom, sqTo: sqTo, figure: oldFigure, crowning: crowning }]) });
        _this.emit(ChessBoard.Events.CHANGE, newCurrPos);
        _this.emit(ChessBoard.Events.MOVE, _this.state.movements[_this.state.movements.length - 1]);
      } else {
        var params = void 0;
        if (argsLen === 1) {
          params = args[0];
        } else {
          params = { from: ChessBoard.sq2san(sqFrom ^ 56), to: ChessBoard.sq2san(sqTo ^ 56) };
          params = crowning ? (0, _extends3.default)({}, params, { promotion: crowning.toLowerCase() }) : params;
        }
        var move = _this.game.move(params);
        if (!move) {
          return _this.emit(ChessBoard.Events.ERROR, ChessBoard.Messages.ERROR_WRONG_MOVE, '');
        } else {
          var newCurrentPos = _this.game.fens().length - 1;
          var sans = _this.game.history();
          var san = sans[sans.length - 1];
          var moveNumber = _this.state.positions[_this.state.positions.length - 1].split(/\s+/)[5];
          var dots = _this.game.turn() === 'b' ? '.' : '. ...';

          _this.setState({ currentPosition: newCurrentPos,
            positions: _this.game.fens(),
            movements: _this.game.history() });

          _this.emit(ChessBoard.Events.CHANGE, newCurrentPos);
          _this.emit(ChessBoard.Events.MOVE, san);

          if (_this.game.in_check() && !_this.game.in_checkmate()) {
            _this.emit(ChessBoard.Events.CHECK, ChessBoard.Messages.CHECK, '' + moveNumber + dots + ' ' + san);
          }

          if (_this.game.game_over()) {
            if (_this.game.in_checkmate()) {
              var _ref2 = _this.game.turn() === 'b' ? ['1-0', moveNumber + '.'] : ['0-1', moveNumber + '. ...'],
                  _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
                  result = _ref3[0],
                  dottedMoveNumber = _ref3[1];

              _this.game.header('Result', result);
              _this.setState({ gameResult: result });
              _this.emit(ChessBoard.Events.CHECK_MATE, ChessBoard.Messages.CHECK_MATE, '' + dottedMoveNumber + san, result);
            } else if (_this.game.in_draw()) {
              if (_this.game.insufficient_material() || _this.game.in_stalemate()) {
                _this.game.header('Result', '1/2-1/2');
                _this.setState({ gameResult: '1/2-1/2' });
                if (_this.game.in_stalemate()) {
                  _this.emit(ChessBoard.Events.STALE_MATE, ChessBoard.Messages.STALE_MATE, '1/2-1/2');
                } else {
                  _this.emit(ChessBoard.Events.INSUFFICIENT_MATERIAL, ChessBoard.Messages.INSUFFICIENT_MATERIAL, '1/2-1/2');
                }
              }
            }
          }
        }
      }
    };

    _this.onSquareClick = function (sq, figure, evt) {
      evt.preventDefault();
      //if (this.whoMovesCurrent() !== ChessBoard.figureColor(figure) && this.sqFrom === -1) {
      //this.sqFrom = -1
      //this.figureFrom = -1
      //this.setState({selectedSq: -1})
      //  return
      //}

      if (_this.sqFrom === -1) {
        if (figure === '0') {
          return;
        } else {
          _this.sqFrom = sq;
          _this.figureFrom = figure;
          _this.setState({ selectedSq: sq, isDragging: false });
          //console.log(`Selected square class name: ${this.refs[ChessBoard.sq2san(sq ^ 56)].className}`)
        }
      } else {
        if (_this.sqFrom === sq) {
          _this.sqFrom = -1;
          _this.figureFrom = '';
          _this.setState({ selectedSq: -1 });
        } else {
          _this.move(_this.sqFrom, sq, _this.figureFrom);
          _this.sqFrom = -1;
          _this.figureFrom = '';
          _this.setState({ selectedSq: -1 });
        }
      }
    };

    _this.onFigureDragStart = function (sq, figure, evt) {

      var size = _this.state.size / 8;
      var pos = size / 2;
      var ctx = document.createElement("canvas").getContext("2d");
      ctx.canvas.width = size;
      ctx.canvas.height = size;
      var img = new Image();
      img.src = evt.target.src;
      ctx.drawImage(img, 0, 0, size, size);
      evt.dataTransfer.setDragImage(ctx.canvas, pos, pos);

      _this.sqFrom = sq;
      _this.figureFrom = figure;
      console.log(_this.sqFrom);
      _this.setState({ selectedSq: sq, isDragging: true });
    };

    _this.onFigureDragEnd = function (evt) {
      var newFen = void 0;
      //console.log("onFigureDragEnd")
      if (_this.state.selectedSq !== -1 && _this.state.mode === ChessBoard.Modes.MODE_SETUP) {
        newFen = _this.putSquare(_this.state.selectedSq, '0');
        _this.setState({ positions: [newFen], selectedSq: -1 });
      }
      _this.setState({ isDragging: false });
    };

    _this.onSquareDrop = function (sq, evt) {
      evt.preventDefault();
      //console.log(`onSquareDrop(sq=${sq}, san=${ChessBoard.sq2san(sq ^ 56)})`)
      if (sq === _this.sqFrom || _this.state.mode !== ChessBoard.Modes.MODE_SETUP && _this.whoMovesCurrent() != ChessBoard.figureColor(_this.figureFrom)) {
        _this.sqFrom = -1;
        _this.figureFrom = '';
        _this.setState({ selectedSq: -1 });
        return;
      }
      if (_this.state.mode === ChessBoard.Modes.MODE_SETUP) {
        //console.log("onSquareDrop")
        var newFen = _this.putSquare(sq, _this.figureFrom);
        _this.setState({ positions: [newFen] });
        _this.sqFrom = -1;
        _this.figureFrom = '';
        return;
      }
      _this.move(_this.sqFrom, sq, _this.figureFrom);
      _this.sqFrom = -1;
      _this.figureFrom = '';
      _this.setState({ selectedSq: -1 });
    };

    _this.setup = function () {
      return _this.setState({ positions: [_this.state.positions[_this.state.currentPosition]],
        currentPosition: 0,
        mode: ChessBoard.Modes.MODE_SETUP });
    };

    _this.analyze = function () {
      return _this.setState({ mode: ChessBoard.Modes.MODE_ANALIZE });
    };

    _this.view = function () {
      return _this.setState({ mode: ChessBoard.Modes.MODE_VIEW });
    };

    _this.play = function () {
      return _this.setState({ mode: ChessBoard.Modes.MODE_PLAY });
    };

    _this.putSquare = function (sq, figure) {
      var _this$state$positions = _this.state.positions[_this.state.currentPosition].split(/\s+/),
          _this$state$positions2 = (0, _slicedToArray3.default)(_this$state$positions, 6),
          pos = _this$state$positions2[0],
          turn = _this$state$positions2[1],
          ep = _this$state$positions2[2],
          castling = _this$state$positions2[3],
          hmc = _this$state$positions2[4],
          fmn = _this$state$positions2[5];

      var epos = ChessBoard.expandPosition(pos).split('');
      epos[sq] = figure;
      var newpos = ChessBoard.compressPosition(epos.join(''));
      return [newpos, turn, ep, castling, hmc, fmn].join(' ');
    };

    _this.toggleNotation = function () {
      return _this.setState({ hideNotation: !_this.state.hideNotation });
    };

    _this.subscribers = [];
    _this.state = {
      mode: _this.props.mode || ChessBoard.defaultSettings.mode,
      size: _this.props.size || ChessBoard.defaultSettings.size,
      flipped: _this.props.flipped || ChessBoard.defaultSettings.flipped,
      chessSet: _this.props.chessSet || ChessBoard.defaultSettings.chessSet,
      currentPosition: _this.props.currentPosition || ChessBoard.defaultSettings.currentPosition,
      positions: _this.props.positions || ChessBoard.defaultSettings.positions,
      movements: _this.props.movements || ChessBoard.defaultSettings.movements,
      lightSqsBg: _this.props.lightSqsBg || ChessBoard.defaultSettings.lightSqsBg,
      darkSqsBg: _this.props.darkSqsBg || ChessBoard.defaultSettings.darkSqsBg,
      selectedSqBg: _this.props.selectedSqBg || ChessBoard.defaultSettings.selectedSqBg,
      showNotation: _this.props.showNotation || ChessBoard.defaultSettings.showNotation,
      whitePlayer: _this.props.whitePlayer || ChessBoard.defaultSettings.whitePlayer,
      blackPlayer: _this.props.blackPlayer || ChessBoard.defaultSettings.blackPlayer,
      hideNotation: _this.props.hideNotation || ChessBoard.defaultSettings.hideNotation,
      gameDate: ChessBoard.date2pgn(new Date()),
      selectedSq: -1,
      isDragging: false,
      isCrowning: false
    };
    _this.sqFrom = -1;
    _this.figureFrom = '';
    _this.moveValidator = props.moveValidator || null;
    return _this;
  }

  /* General functions */

  (0, _createClass3.default)(ChessBoard, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      //Waring! Delete next line in production!!!
      window.board1 = this;
      if (this.props.moveValidator) {
        this.game = new _chess2.default(this.state.positions[0]);
        this.setBaseHeaders();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      // console.log(`Rendering board (size ${this.state.size} pixels) id=${this.props.id || "No Id"}`)
      // console.log(`Selected square = ${ChessBoard.sq2san(this.state.selectedSq ^ 56)}`)
      var imgSize = ChessBoard.chessSets[this.state.chessSet].size;
      var figures = ChessBoard.expandPosition(this.state.positions[this.state.currentPosition].split(/\s+/)[0]);
      var chosenRows = this.state.flipped ? ChessBoard.range(7, -1).map(function (n) {
        return ChessBoard.range(n * 8 + 7, n * 8 - 1);
      }) : ChessBoard.range().map(function (n) {
        return ChessBoard.range(n * 8, n * 8 + 8);
      });
      var rows = chosenRows.map(function (row, nrow) {
        var rowIndex = _this2.state.flipped ? nrow : 7 - nrow;
        return _react2.default.createElement('div', { key: rowIndex, ref: 'row_' + rowIndex, style: { height: _this2.state.size / 8 + 'px',
            width: _this2.state.size + 'px',
            textAlign: 'center',
            backgroundColor: '#3333333',
            opacity: _this2.state.isCrowning ? '0.5' : '1' } }, row.map(function (sq, index) {
          var san = ChessBoard.sq2san(sq ^ 56);
          var figure = figures[sq];
          var content = void 0,
              imgsrc = void 0;
          if (figure === '0') {
            content = '';
          } else {
            //let imgsrc = `/static/img/sets/${this.state.chessSet}/${ChessBoard.letter2img[figure]}`
            content = _react2.default.createElement('img', {
              src: ChessBoard.chessSets[_this2.state.chessSet][figure],
              draggable: ChessBoard.figureColor(figure) === _this2.whoMovesCurrent() ? true : true,
              figure: figure,
              color: ChessBoard.figureColor(figure),
              style: {
                width: imgSize + '%',
                height: imgSize + '%',
                cursor: ChessBoard.figureColor(figure) === _this2.whoMovesCurrent() ? "pointer" : "not-allowed",
                opacity: _this2.state.isDragging && _this2.state.selectedSq === sq ? "0" : "1"
              },
              onDragStart: function onDragStart(evt) {
                return _this2.onFigureDragStart(sq, figure, evt);
              },
              onDragEnd: function onDragEnd(ev) {
                return _this2.onFigureDragEnd(ev);
              }
            });
          }
          return _react2.default.createElement('div', { key: sq,
            onClick: function onClick(evt) {
              return _this2.onSquareClick(sq, figure, evt);
            },
            onDragOver: function onDragOver(evt) {
              evt.preventDefault();
            },
            onDrop: function onDrop(evt) {
              return _this2.onSquareDrop(sq, evt);
            },
            className: sq === _this2.state.selectedSq ? 'selectedSq' : 'unselectedSq',
            style: { display: 'inline-block',
              width: _this2.state.size / 8 + 'px',
              height: _this2.state.size / 8 + 'px',
              verticalAlign: 'middle',
              textAlign: 'center',
              paddingTop: imgSize === 100 ? 0 : (100 - imgSize) / 10 + '%',
              backgroundColor: sq === _this2.state.selectedSq ? _this2.state.selectedSqBg : ChessBoard.isBlackSquare(sq ^ 56) ? _this2.state.darkSqsBg : _this2.state.lightSqsBg },
            ref: san,
            tooltip: san,
            color: ChessBoard.isBlackSquare(sq ^ 56) ? 'b' : 'w'
          }, content);
        }));
      });

      return _react2.default.createElement('div', { style: { display: 'inline-block' }, onDoubleClick: function onDoubleClick() {
          return _this2.flip();
        } }, _react2.default.createElement('div', {
        style: {
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          border: 'solid 1px navy',
          backgroundColor: '#333333',
          opacity: this.state.isCrowning ? '0.8' : '1'
        }
      }, rows, _react2.default.createElement('div', { ref: 'crowningPanel',
        style: { width: this.state.size / 2,
          height: this.state.size / 8,
          color: 'white',
          display: this.state.isCrowning ? 'block' : 'none',
          position: 'fixed',
          left: this.crowningInfo ? this.crowningInfo.left : 0,
          top: this.crowningInfo ? this.crowningInfo.top : 0,
          zIndex: '100'
        }
      }, ['q', 'n', 'r', 'b'].map(function (f) {
        return _this2.crowningInfo ? _this2.crowningInfo.figColor === 'w' ? f.toUpperCase() : f : f;
      }).map(function (figure, i) {
        var wh = _this2.state.size / 8;
        var ref = 'crowning_' + figure;
        return _react2.default.createElement('div', { style: {
            display: 'inline-block',
            width: wh,
            height: wh,
            backgroundColor: _this2.crowningInfo ? _this2.crowningInfo.sqColor === 'b' ? _this2.state.darkSqsBg : _this2.state.lightSqsBg : _this2.state.darkSqsBg
          },
          onClick: function onClick(e) {
            var _crowningInfo = _this2.crowningInfo,
                sqFrom = _crowningInfo.sqFrom,
                sqTo = _crowningInfo.sqTo,
                figureFrom = _crowningInfo.figureFrom;

            _this2.setState({ isCrowning: false });
            // console.log(`figureFrom: ${figureFrom} - figure: ${figure}`)
            _this2.move(sqFrom, sqTo, figureFrom, figure);
          },

          ref: ref,
          key: i
        }, _react2.default.createElement('img', {
          src: ChessBoard.chessSets[_this2.state.chessSet][figure],
          style: {
            width: '100%',
            height: '100%',
            cursor: 'pointer'
          }
        }));
      }))), _react2.default.createElement('div', {
        ref: 'notation',
        style: {
          display: this.state.hideNotation || !this.props.moveValidator || this.state.mode === ChessBoard.Modes.MODE_SETUP ? 'none' : 'inherit',
          border: 'solid 1px navy',
          borderTop: 'none',
          width: this.state.size + 'px',
          height: parseInt(this.state.size / 4) + 'px',
          overflow: 'auto',
          fontSize: '12pt'
          /* paddingLeft: '0.5em',
          paddingTop: '0.5em', */
        }
      }, this.getPgnText()), _react2.default.createElement('div', {
        ref: 'setup_panel',
        style: {
          display: this.state.mode !== ChessBoard.Modes.MODE_SETUP ? 'none' : 'inherit',
          border: 'solid 1px navy',
          borderTop: 'none',
          width: this.state.size + 'px',
          //height: `${parseInt(this.state.size / 3)}px`,
          height: '150px',
          overflow: 'auto',
          fontSize: '12pt',
          backgroundColor: this.state.lightSqsBg
        }
      }, _react2.default.createElement('div', { style: { paddingLeft: '10px', paddingTop: '0' } }, _react2.default.createElement('div', { style: { display: 'inline-block',
          height: '50px',
          width: '50px',
          border: 'solid 1 px'
        },
        figure: 'p'
      }, _react2.default.createElement('img', {
        onDragStart: function onDragStart(evt) {
          return _this2.onFigureDragStart(-1, 'p', evt);
        },
        onDragEnd: function onDragEnd(ev) {
          return _this2.onFigureDragEnd(ev);
        },
        src: ChessBoard.chessSets[this.state.chessSet]['p'], figure: 'p', draggable: true,
        width: '100%', height: '100%'
      })), _react2.default.createElement('div', { style: { display: 'inline-block',
          height: '50px',
          width: '50px',
          border: 'solid 1 px'
        },
        figure: 'P'
      }, _react2.default.createElement('img', {
        onDragStart: function onDragStart(evt) {
          return _this2.onFigureDragStart(-1, 'P', evt);
        },
        onDragEnd: function onDragEnd(ev) {
          return _this2.onFigureDragEnd(ev);
        },
        src: ChessBoard.chessSets[this.state.chessSet]['P'], figure: 'P', draggable: true,
        width: '100%', height: '100%'
      })), _react2.default.createElement('div', { style: { display: 'inline-block',
          height: '50px',
          width: '50px',
          border: 'solid 1 px'
        },
        figure: 'n'
      }, _react2.default.createElement('img', {
        onDragStart: function onDragStart(evt) {
          return _this2.onFigureDragStart(-1, 'n', evt);
        },
        onDragEnd: function onDragEnd(ev) {
          return _this2.onFigureDragEnd(ev);
        },
        src: ChessBoard.chessSets[this.state.chessSet]['n'], figure: 'n', draggable: true,
        width: '100%', height: '100%'
      })), _react2.default.createElement('div', { style: { display: 'inline-block',
          height: '50px',
          width: '50px',
          border: 'solid 1 px'
        },
        figure: 'N'
      }, _react2.default.createElement('img', {
        onDragStart: function onDragStart(evt) {
          return _this2.onFigureDragStart(-1, 'N', evt);
        },
        onDragEnd: function onDragEnd(ev) {
          return _this2.onFigureDragEnd(ev);
        },
        src: ChessBoard.chessSets[this.state.chessSet]['N'], figure: 'N', draggable: true,
        width: '100%', height: '100%'
      })), _react2.default.createElement('div', { style: { display: 'inline-block',
          height: '50px',
          width: '50px',
          border: 'solid 1 px'
        },
        figure: 'b'
      }, _react2.default.createElement('img', {
        onDragStart: function onDragStart(evt) {
          return _this2.onFigureDragStart(-1, 'b', evt);
        },
        onDragEnd: function onDragEnd(ev) {
          return _this2.onFigureDragEnd(ev);
        },
        src: ChessBoard.chessSets[this.state.chessSet]['b'], figure: 'b', draggable: true,
        width: '100%', height: '100%'
      })), _react2.default.createElement('div', { style: { display: 'inline-block',
          height: '50px',
          width: '50px',
          border: 'solid 1 px'
        },
        figure: 'B'
      }, _react2.default.createElement('img', {
        onDragStart: function onDragStart(evt) {
          return _this2.onFigureDragStart(-1, 'B', evt);
        },
        onDragEnd: function onDragEnd(ev) {
          return _this2.onFigureDragEnd(ev);
        },
        src: ChessBoard.chessSets[this.state.chessSet]['B'], figure: 'B', draggable: true,
        width: '100%', height: '100%'
      })), _react2.default.createElement('div', { style: { display: 'inline-block',
          height: '50px',
          width: '50px',
          border: 'solid 1 px',
          marginLeft: '20px'
        }
      }, _react2.default.createElement('button', { onClick: function onClick() {
          return _this2.empty();
        } }, 'Empty')), _react2.default.createElement('div', { style: { display: 'inline-block',
          height: '50px',
          width: '50px',
          border: 'solid 1 px',
          marginLeft: '20px'
        }
      }, _react2.default.createElement('button', { onClick: function onClick() {
          return _this2.reset();
        } }, 'Initial'))), _react2.default.createElement('div', { style: { paddingLeft: '10px', paddingTop: '0' } }, _react2.default.createElement('div', { style: { display: 'inline-block',
          height: '50px',
          width: '50px',
          border: 'solid 1 px'
        },
        figure: 'r'
      }, _react2.default.createElement('img', {
        onDragStart: function onDragStart(evt) {
          return _this2.onFigureDragStart(-1, 'r', evt);
        },
        onDragEnd: function onDragEnd(ev) {
          return _this2.onFigureDragEnd(ev);
        },
        src: ChessBoard.chessSets[this.state.chessSet]['r'], figure: 'r', draggable: true,
        width: '100%', height: '100%'
      })), _react2.default.createElement('div', { style: { display: 'inline-block',
          height: '50px',
          width: '50px',
          border: 'solid 1 px'
        },
        figure: 'R'
      }, _react2.default.createElement('img', {
        onDragStart: function onDragStart(evt) {
          return _this2.onFigureDragStart(-1, 'R', evt);
        },
        onDragEnd: function onDragEnd(ev) {
          return _this2.onFigureDragEnd(ev);
        },
        src: ChessBoard.chessSets[this.state.chessSet]['R'], figure: 'R', draggable: true,
        width: '100%', height: '100%'
      })), _react2.default.createElement('div', { style: { display: 'inline-block',
          height: '50px',
          width: '50px',
          border: 'solid 1 px'
        },
        figure: 'q'
      }, _react2.default.createElement('img', {
        onDragStart: function onDragStart(evt) {
          return _this2.onFigureDragStart(-1, 'q', evt);
        },
        onDragEnd: function onDragEnd(ev) {
          return _this2.onFigureDragEnd(ev);
        },
        src: ChessBoard.chessSets[this.state.chessSet]['q'], figure: 'q', draggable: true,
        width: '100%', height: '100%'
      })), _react2.default.createElement('div', { style: { display: 'inline-block',
          height: '50px',
          width: '50px',
          border: 'solid 1 px'
        },
        figure: 'Q'
      }, _react2.default.createElement('img', {
        onDragStart: function onDragStart(evt) {
          return _this2.onFigureDragStart(-1, 'Q', evt);
        },
        onDragEnd: function onDragEnd(ev) {
          return _this2.onFigureDragEnd(ev);
        },
        src: ChessBoard.chessSets[this.state.chessSet]['Q'], figure: 'Q', draggable: true,
        width: '100%', height: '100%'
      })), _react2.default.createElement('div', { style: { display: 'inline-block',
          height: '50px',
          width: '50px',
          border: 'solid 1 px'
        },
        figure: 'k'
      }, _react2.default.createElement('img', {
        onDragStart: function onDragStart(evt) {
          return _this2.onFigureDragStart(-1, 'k', evt);
        },
        onDragEnd: function onDragEnd(ev) {
          return _this2.onFigureDragEnd(ev);
        },
        src: ChessBoard.chessSets[this.state.chessSet]['k'], figure: 'k', draggable: true,
        width: '100%', height: '100%'
      })), _react2.default.createElement('div', { style: { display: 'inline-block',
          height: 50 + 'px',
          width: 50 + 'px',
          border: 'solid 1 px'
        },
        figure: 'K'
      }, _react2.default.createElement('img', {
        onDragStart: function onDragStart(evt) {
          return _this2.onFigureDragStart(-1, 'K', evt);
        },
        onDragEnd: function onDragEnd(ev) {
          return _this2.onFigureDragEnd(ev);
        },
        src: ChessBoard.chessSets[this.state.chessSet]['K'], figure: 'K', draggable: true,
        width: '100%', height: '100%' })), _react2.default.createElement('div', { style: { display: 'inline-block',
          height: '50px',
          width: '50px',
          border: 'solid 1 px',
          marginLeft: '20px'
        }
      }, _react2.default.createElement('button', { onClick: function onClick() {
          _this2.loadFen(_this2.state.positions[0]);
          _this2.analyze();
        } }, 'Done')))));
    }
  }]);

  return ChessBoard;
}(_react.Component);

ChessBoard.version = '0.4.5';
ChessBoard.Modes = {
  MODE_SETUP: 'MODE_SETUP',
  MODE_ANALYSIS: 'MODE_ANALYSIS',
  MODE_VIEW: 'MODE_VIEW',
  MODE_PLAY: 'MODE_PLAY' };

ChessBoard.range = function () {
  var b = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : b + 8;
  var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return b === e ? r : ChessBoard.range(b < e ? b + 1 : b - 1, e, [].concat((0, _toConsumableArray3.default)(r), [b]));
};

ChessBoard.compose = function () {
  for (var _len3 = arguments.length, fns = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    fns[_key3] = arguments[_key3];
  }

  return function (arg) {
    return fns.reduce(function (a, f) {
      return f(a);
    }, arg);
  };
};

ChessBoard.partition = function (arr) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  var r = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  return arr.length > 0 ? ChessBoard.partition(arr.slice(n), n, [].concat((0, _toConsumableArray3.default)(r), [arr.slice(0, n)])) : r;
};

ChessBoard.partPosition = function (pos) {
  return ChessBoard.partition([].concat((0, _toConsumableArray3.default)(pos))).map(function (r) {
    return r.join('');
  }).join('/');
};

ChessBoard.compressPosition = function (pos) {
  return ChessBoard.partPosition(pos).replace(/0+/g, function (m) {
    return m.length.toString();
  });
};

ChessBoard.expandPosition = function (pos) {
  return pos.replace(/\//g, '').replace(/[1-8]/g, function (d) {
    return ChessBoard.range(0, parseInt(d)).map(function (i) {
      return '0';
    }).join('');
  });
};

ChessBoard.sqBgLabels = ['Blue', 'Brown', 'Acqua', 'Maroon'];
ChessBoard.lightSqBgs = ['#add8e6', '#f0d9b5', '#dfdfdf', '#FFF2D7'];
ChessBoard.darkSqBgs = ['#6495ed', '#b58863', '#56b6e2', "#B2535B"];
ChessBoard.selectedSqBg = '#bfd';
ChessBoard.emptyPosition = ChessBoard.range(0, 64).map(function (i) {
  return '0';
}).join('');
ChessBoard.defaultPosition = 'rnbqkbnrpppppppp00000000000000000000000000000000PPPPPPPPRNBQKBNR';
ChessBoard.sicilianPosition = 'rnbqkbnrpp0ppppp0000000000p000000000P00000000000PPPP0PPPRNBQKBNR';
ChessBoard.emptyFen = '8/8/8/8/8/8/8/8 w KQkq - 0 1';
ChessBoard.defaultFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
ChessBoard.sicilianFen = 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1';
ChessBoard.pgnTagLineRE = /^\s*\[\s*(.+?)\s+"(.+?)"\s*\]\s*$/;
ChessBoard.sanRE = /(?:(^0-0-0|^O-O-O)|(^0-0|^O-O)|(?:^([a-h])(?:([1-8])|(?:x([a-h][1-8])))(?:=?([NBRQ]))?)|(?:^([NBRQK])([a-h])?([1-8])?(x)?([a-h][1-8])))(?:(\+)|(#)|(\+\+))?$/;
ChessBoard.defaultSettings = {
  size: 400,
  flipped: false,
  chessSet: 'default',
  currentPosition: 0,
  positions: [ChessBoard.defaultFen],
  lightSqsBg: ChessBoard.lightSqBgs[0],
  darkSqsBg: ChessBoard.darkSqBgs[0],
  selectedSqBg: ChessBoard.selectedSqBg,
  movements: [],
  isCrowning: false,
  showNotation: true,
  whitePlayer: 'White Player',
  blackPlayer: 'Black Player',
  lang: 'en',
  mode: ChessBoard.Modes.MODE_ANALYSIS,
  hideNotation: false
};

ChessBoard.row = function (sq) {
  return parseInt(sq / 8);
};

ChessBoard.col = function (sq) {
  return sq % 8;
};

ChessBoard.difCol = function (sq1, sq2) {
  return Math.abs(ChessBoard.col(sq1) - ChessBoard.col(sq2));
};

ChessBoard.difRow = function (sq1, sq2) {
  return Math.abs(ChessBoard.row(sq1) - ChessBoard.row(sq2));
};

ChessBoard.isSameCol = function (sq1, sq2) {
  return ChessBoard.difCol(sq1, sq2) === 0;
};

ChessBoard.isSameRow = function (sq1, sq2) {
  return ChessBoard.difRow(sq1, sq2) === 0;
};

ChessBoard.isDiagonal = function (sq1, sq2) {
  return sq1 != sq2 && ChessBoard.difRow(sq1, sq2) === ChessBoard.difCol(sq1, sq2);
};

ChessBoard.isAntiDiagonal = function (sq1, sq2) {
  return ChessBoard.isDiagonal(sq1, sq2) && Math.abs(sq1 - sq2) % 7 === 0;
};

ChessBoard.isBlackSquare = function (sq) {
  return ChessBoard.row(sq) % 2 === 0 && ChessBoard.col(sq) % 2 === 0 || ChessBoard.row(sq) % 2 === 1 && ChessBoard.col(sq) % 2 === 1;
};

ChessBoard.sq2san = function (sq) {
  return sq >= 0 && sq < 64 ? '' + String.fromCharCode(97 + ChessBoard.col(sq)) + (ChessBoard.row(sq) + 1) : '-';
};

ChessBoard.san2sq = function (san) {
  return san.charCodeAt(0) - 97 + (parseInt(san[1]) - 1) * 8;
};

ChessBoard.figureColor = function (figure) {
  return figure ? figure === figure.toLowerCase() ? 'b' : 'w' : '-';
};

ChessBoard.date2pgn = function (date) {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
};

ChessBoard.letter2img = { p: 'p.png', P: 'pw.png',
  n: 'n.png', N: 'nw.png',
  b: 'b.png', B: 'bw.png',
  r: 'r.png', R: 'rw.png',
  q: 'q.png', Q: 'qw.png',
  k: 'k.png', K: 'kw.png' };
ChessBoard.chessSets = {
  alt1: _chessSets2.default.alt1,
  default: _chessSets2.default.default,
  eyes: _chessSets2.default.eyes,
  fantasy: _chessSets2.default.fantasy,
  modern: _chessSets2.default.modern,
  spatial: _chessSets2.default.spatial,
  veronika: _chessSets2.default.veronika
};
ChessBoard.Events = {
  CHECK_MATE: "CHECK_MATE",
  CHECK: "CHECK",
  DRAW: "DRAW",
  STALE_MATE: "STALE_MATE",
  INSUFFICIENT_MATERIAL: "INSUFFICIENT_MATERIAL",
  MOVE: "MOVE",
  ERROR: "ERROR",
  CHANGE: "CHANGE",
  FLIP: "FLIP"
};
ChessBoard.Messages = {
  CHECK_MATE: { en: 'Checkmate', es: 'Jaque Mate' },
  CHECK: { en: 'Check', es: 'Jaque' },
  STALE_MATE: { en: 'Stalemate draw', es: 'Tablas por mate ahogado' },
  INSUFFICIENT_MATERIAL: { en: 'Draw for insufficient material', es: 'Tablas por material insuficiente' },
  WRONG_MOVE: { en: 'Wrong move', es: 'Movimiento incorrecto' },
  ERROR_LOAD_FEN: { en: "Could not load position", es: "No se pudo cargar la posición" },
  ERROR_PREV_POS: { en: "Attempt to move from a non last position", es: "Intento de mover desde una posición que no es la última" },
  ERROR_MOVE_ARGS: { en: "Move called with wrong number of arguments", es: "Función 'move' invocada con número incorrecto de argumentos" },
  ERROR_MOVE_TURN: { en: "Attempt to move the wrong color", es: "Intento de mover el color equivocadd" },
  ERROR_CANT_PROCESS_SAN: { en: "Can't process standard algebraic notation (SAN) move without a move validator", es: "No se puede procesar movimiento en notación algebraica estandard (SAN) sin un validador de movimientos" },
  ERROR_WRONG_MOVE: { en: 'Wrong move', es: 'Movida errónea' }
};
ChessBoard.Figurines = {
  p: { codePoint: '0x265f', html: '&#9823;' },
  n: { codePoint: '0x265e', html: '&#9822;' },
  b: { codePoint: '0x265d', html: '&#9821;' },
  r: { codePoint: '0x265c', html: '&#9820;' },
  q: { codePoint: '0x265b', html: '&#9819;' },
  k: { codePoint: '0x265a', html: '&#9818;' },
  P: { codePoint: '0x2659', html: '&#9817;' },
  N: { codePoint: '0x2658', html: '&#9816;' },
  B: { codePoint: '0x2657', html: '&#9815;' },
  R: { codePoint: '0x2656', html: '&#9814;' },
  Q: { codePoint: '0x2655', html: '&#9813;' },
  K: { codePoint: '0x2654', html: '&#9812;' }
};

ChessBoard.getAvailSqColors = function () {
  return { light: ChessBoard.lightSqBgs, dark: ChessBoard.darkSqBgs, labels: ChessBoard.sqBgLabels };
};

exports.default = ChessBoard;