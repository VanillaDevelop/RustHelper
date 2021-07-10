# Rust Helper
Rust Helper is a free, open-source application built using Vue, meant as an assistant for the video game Rust. 


## Project setup
Usual yarn commands apply.  

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

## Background Information
### Furnace Calculator

Rust Furnaces, at the time of writing, work as follows:  
- For each 4 wood burned, 3 charcoal is created
- For each 5 wood burned, 1 metal fragment is created (from 1 metal ore)
- For each 2.5 wood burned, 1 sulfur is created (from 1 sulfur ore)
- For each 10 wood burned, 1 HQM is created (from 1 HQM ore)
- Wood burns at a rate of 1/2 seconds

