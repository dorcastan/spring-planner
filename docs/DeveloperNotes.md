# Developer Notes

## Overview

* Run the project locally: `npm start`

* Technologies used
    * React for components
    * CSS for styling
    * [Sass](https://sass-lang.com/) for easier styling (testing it out: `TaskList.scss`)
    * [TypeScript](https://www.typescriptlang.org/) for type checking
    * [PropTypes](https://www.npmjs.com/package/prop-types) for type checking React props (not needed anymore)
    
* Development dependencies
    * [Webpack](https://webpack.js.org/) to bundle JavaScript modules into static assets

## Design Considerations

## Choice of Tools

1. TypeScript over Flow

Originally intended to use Facebook's [Flow](https://flow.org/) because of its flexibility and integration with React.
(Bonus: It was the recommended tool in Grab's front-end guide, which I was following when I started this project.)

Decided to work with TypeScript in the end as I will need it for an upcoming project. Also, it's stable.
Might change in future as migrating between the two should not be too difficult anyway.
