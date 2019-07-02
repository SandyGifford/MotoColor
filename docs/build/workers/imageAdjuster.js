/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/prod/workers/imageAdjuster.worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/prod/utils/ColorUtils.ts":
/*!**************************************!*\
  !*** ./src/prod/utils/ColorUtils.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ColorUtils; });
// based on https://gist.github.com/mjackson/5311256
class ColorUtils {
    static getCSSColor(color) {
        const { h, s, l, a } = color;
        return `hsla(${360 * h / 255}, ${100 * s / 255}%, ${100 * l / 255}%, ${a / 255})`;
    }
    /**
     * Converts an RGB color value to HSL. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h, s, and l in the set [0, 1].
     *
     * @param   Number  r       The red color value
     * @param   Number  g       The green color value
     * @param   Number  b       The blue color value
     * @return  Array           The HSL representation
     */
    static rgbToHSL(color) {
        let [r, g, b, a] = color;
        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0; // achromatic
        }
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return [h * 255, s * 255, l * 255, a];
    }
    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  l       The lightness
     * @return  Array           The RGB representation
     */
    static hslToRGB(color) {
        let [h, s, l, a] = color;
        h /= 255;
        s /= 255;
        l /= 255;
        let r, g, b;
        if (s === 0) {
            r = g = b = l; // achromatic
        }
        else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = ColorUtils.hue2RGBComponent(p, q, h + 1 / 3);
            g = ColorUtils.hue2RGBComponent(p, q, h);
            b = ColorUtils.hue2RGBComponent(p, q, h - 1 / 3);
        }
        return [r * 255, g * 255, b * 255, a];
    }
    static hue2RGBComponent(p, q, t) {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
}


/***/ }),

/***/ "./src/prod/utils/ImageUtils.ts":
/*!**************************************!*\
  !*** ./src/prod/utils/ImageUtils.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ImageUtils; });
/* harmony import */ var _ColorUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ColorUtils */ "./src/prod/utils/ColorUtils.ts");

class ImageUtils {
    static forEachPixel(pixels, act) {
        for (let i = 0; i < pixels.length; i += 4)
            act([
                pixels[i],
                pixels[i + 1],
                pixels[i + 2],
                pixels[i + 3]
            ], i / 4, i);
    }
    static mapPixels(pixels, act) {
        const arr = [];
        ImageUtils.forEachPixel(pixels, (pixel, pixelIndex, componentIndex) => arr.push(act(pixel, pixelIndex, componentIndex)));
        return arr;
    }
    static mapPixelsToPixels(pixels, act) {
        const arr = new Uint8ClampedArray(pixels.length);
        ImageUtils.forEachPixel(pixels, (pixel, pI, cI) => {
            const newPixel = act(pixel, pI, cI);
            arr[cI] = newPixel[0];
            arr[cI + 1] = newPixel[1];
            arr[cI + 2] = newPixel[2];
            arr[cI + 3] = newPixel[3];
        });
        return arr;
    }
    static loadImage(url) {
        return new Promise((res, rej) => {
            const img = document.createElement("img");
            img.addEventListener("load", () => res(img));
            img.addEventListener("error", rej);
            img.src = url;
        });
    }
    static loadImageIntoCanvas(url) {
        return ImageUtils.loadImage(url)
            .then(img => {
            const cvs = document.createElement("canvas");
            const ctx = cvs.getContext("2d");
            cvs.width = img.width;
            cvs.height = img.height;
            ctx.drawImage(img, 0, 0);
            return cvs;
        });
    }
    static loadImageIntoRGBPixelData(url) {
        return ImageUtils.loadImageIntoCanvas(url)
            .then(cvs => {
            const { width, height } = cvs;
            const ctx = cvs.getContext("2d");
            const imageData = ctx.getImageData(0, 0, width, height);
            const { data } = imageData;
            const pixels = new Uint8ClampedArray(data);
            return {
                pixels,
                width,
                height,
            };
        });
    }
    static loadImageIntoHSLPixelData(url) {
        return ImageUtils.loadImageIntoRGBPixelData(url)
            .then(pixelData => ({
            width: pixelData.width,
            height: pixelData.height,
            pixels: ImageUtils.mapPixelsToPixels(pixelData.pixels, _ColorUtils__WEBPACK_IMPORTED_MODULE_0__["default"].rgbToHSL),
        }));
    }
}


/***/ }),

/***/ "./src/prod/utils/NumberUtils.ts":
/*!***************************************!*\
  !*** ./src/prod/utils/NumberUtils.ts ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NumberUtils; });
class NumberUtils {
    static clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }
}


/***/ }),

/***/ "./src/prod/workers/imageAdjuster.worker.ts":
/*!**************************************************!*\
  !*** ./src/prod/workers/imageAdjuster.worker.ts ***!
  \**************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_NumberUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @utils/NumberUtils */ "./src/prod/utils/NumberUtils.ts");
/* harmony import */ var _utils_ImageUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @utils/ImageUtils */ "./src/prod/utils/ImageUtils.ts");


let basePixels;
onmessage = e => {
    const { type, id, data } = e.data;
    switch (type) {
        case "setBasePixels":
            basePixels = data;
            postMessage({
                id,
                type: "basePixelsUpdated",
                data: true,
            }, undefined);
            break;
        case "adjustImage":
            const { adjustment, transferBuffer } = data;
            const uint8 = new Uint8ClampedArray(transferBuffer);
            const s = adjustment[1] / 128;
            const l = adjustment[2] / 128;
            _utils_ImageUtils__WEBPACK_IMPORTED_MODULE_1__["default"].forEachPixel(basePixels, (pixel, pI, cI) => {
                uint8[cI] = adjustment[0];
                uint8[cI + 1] = _utils_NumberUtils__WEBPACK_IMPORTED_MODULE_0__["default"].clamp(pixel[1] * s, 0, 255);
                uint8[cI + 2] = _utils_NumberUtils__WEBPACK_IMPORTED_MODULE_0__["default"].clamp(pixel[2] * l, 0, 255);
                uint8[cI + 3] = pixel[3];
            });
            const message = {
                id,
                type: "pixelsAdjusted",
                data: uint8.buffer,
            };
            postMessage(message, undefined, [uint8.buffer]);
            break;
    }
};


/***/ })

/******/ });
//# sourceMappingURL=imageAdjuster.js.map