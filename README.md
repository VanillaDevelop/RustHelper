# Rust Helper
Rust Helper is a free, open-source application built using Vue, meant as an assistant for the video game Rust.  
After setting up (in production or development mode), the web app is found under http://localhost:8080/rust-helper.  
Rust Helper stores data entirely using LocalStorage, meaning no account data is needed. As long as the LocalStorage data is not cleared, data will persist while on the same machine.   

Rust Helper is powered by the Vue framework, VueX state management, BootstrapVue for easy styling, v-select for more visually pleasing select boxes, and RustMaps.com for the map generation API. 

## Project setup
To install the dependencies  
```
yarn install
```

To run in development mode (including hot-reloading)  
```
yarn serve
```

To build for production  
```
yarn build
```

Linting  
```
yarn lint
```


## Modules
### Multi-server support
Servers can be added or deleted on the **Overview** page. By clicking any server name, or using the dropdown menu in the top right, you can switch between these servers, which allows you to store separate data for each submodule per server (i.e., each server can have a different map with different markers, a different build cost calculation, and different furnaces with different timers)

### Furnace Calculator
Rust Furnaces, at the time of writing, work as follows:  
- For each 4 wood burned, 3 charcoal is created
- For each 5 wood burned, 1 metal fragment is created (from 1 metal ore)
- For each 2.5 wood burned, 1 sulfur is created (from 1 sulfur ore)
- For each 10 wood burned, 1 HQM is created (from 1 HQM ore)
- Wood burns at a rate of 1/2 seconds  

From these calculations, the Furnace Calculator Module generates the output to any given furnace input using a "breakpoint" based algorithm (allowing the computation of many steps in one function iteration, rather than a single furnace tick). Multiple furnaces can be calculated simultaneously. Timers can be started on a per-furnace basis. When this timer runs out, the state of the furnace will be transformed in the result of the previous input. Timers are stored in LocalStorage and will resume when the page is reloaded.

### Map View
Rust Helper uses the [RustMaps](https://rustmaps.com) API to generate map images for Rust Servers, given a seed and map size. Monument positions and names are loaded directly from the RustMaps API and are displayed on an HTML5 Canvas (powered by [fabric.js](http://fabricjs.com/)). Rust Helper offers the addition of various shape and color markers, which can be moved, rescaled, and rotated, in order to mark additional objectives on the map. As noted previously, the map and map markers may differ for each unique server created in the Rust Helper application. In order to prevent API Key abuse, you must provide your own RustMaps.com API key to use this module. It will not be propagated anywhere, except to the RustMaps API itself.

### Build Cost Calculator
The Build Cost Calculator is a relatively simple module which allows the summation of costs for common building materials, tools, and deployables. Its goal is to provide an estimate of costs for bases small enough to not require visual aid to conceptualize, or for quick queries of how much an extention to a base would cost. As with the other modules, a custom list of inputs can be stored for each created server.

