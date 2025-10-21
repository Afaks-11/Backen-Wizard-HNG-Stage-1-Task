**String Analyzer API**
A simple RESTful API that analyzes strings, stores their properties, and supports natural language filtering using the natural NLP library.

**Endpoints**

- POST /strings Analyze and store a new string
- GET /strings Retrieve all stored strings
- DELETE /string/:value Delete a string by value
- GET /strings/filter-by-natural-language?query=... Filter using natural language (e.g., “all single word palindromic strings)]

**Setup**
1 git clone https://github.com/Afaks-11/Backen-Wizard-HNG-Stage-1-Task.git
2 cd Backen-Wizard-HNG-Stage-1-Task
3 npm i
4 npm run dev

**Author**
Hamman Afakirya
