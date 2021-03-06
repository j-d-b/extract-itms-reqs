# Extract ITMS Requirements
Searches `.docx` documents for ITMS Requirements, noting duplicates and totals.

Looks for `ITMSREQ-` followed by numbers to determine requirements.

## Usage
### Prerequisites
* [Node.js](https://nodejs.org/) (>=11)

### Setup
Create a `data/` directory at the project root with all `.docx` documents that should be searched for requirements.

### Running the script
Install dependencies
```
npm install
```

From the project root, run
```
node index
```

## Output
The script will output some useful information in the console as well as two files:
* `output/duplicates.txt`: a list of requirements that occur more than once, along with which files they occur in
* `output/requirements.txt`: a line-separated list of all unique requirements found in the input files
