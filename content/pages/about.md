+++
title = "Sanket Arun Kamath"
path = "about"
+++
<!-- !pandoc -s % -c %:h/resume.css -V lang=en  -o ~/Downloads/resume.docx  -->
<!-- cspell:ignore Sanket,Arun,Kamath,Inkscape,Krita,Postgres -->

## General Information

- Roles: Senior Software Engineer
- Email: sanketkamath1996@gmail.com
- Phone: 9449063585

| Skill | tools |
| -- | -- |
| Programming language | Python (primary), Rust, Javascript, Bash, C#|
| Platforms | Linux, Windows |
| Libraries used | Pandas, Pydantic, Sqlalchmey, Request, Fastapi  |
| Database | sqlite, postgres |
| Editors | Vim, Vscode, Pycharm |
| Orchestration | Kubernetes, Airflow, Azure pipeline, docker |
| Feilds worked | Task Mining, Automation |
| Others |  pdb, ssh, git  |

<br/>

| Company | Duration |
| -- | -- |
| SOROCO | 6.5  Years|


## Work Projects


### Business Mapping and Contextualization of Gaps


Utilized AI-powered tools to generate potential Key Performance Indicators (KPIs) and business problems related to industrial processes.

Contributions:

* Generate prompts to generate CSV formatted data for give industry and process.
* Handle token limit for the same and other issues for prompt output.
* Make notebook self-serviceable to reduce developer time.

Technologies Leveraged:

* OpenAI library to communicate with llama models.
* Pandas to parse the output.
- Postgres to store and retrieve data.


### Digital Gap framework


Improved user experience by identifying gaps and suggesting solution for optimization of workflow.

Contributions:

* Design Frameworks as two-pass calculation approach:
  1. Python logic to generate evidence with task metrics.
  1. Utilized a configurable rule engine to evaluate task metrics meets conditions or mark gaps in the system.
* Implementation of rule engine and few evidences.
* Later Assist others to adopt framework for other type of gaps.

Technologies Leveraged:

* Pydantic to validate and parse rules.
- Airflow to scheduling workflow.
- Postgres to store and retrieve data.


### Document Engine


Generate high level integration of click and keystroke events on excel to into meaningful actions like copy or format table.

Contributions:

* Design a two-step rule engine for grouping keystroke/click to meaningful action.
  1. first mark particular key stroke as components of action
  1. generate long string and match regex to find pattern of components which actually make action.
* Implement the rule engine.
* Provide rule like copy, format table etc.
* Later Assist others to adopt rule engine to evaluate action on other apps.
* It became core part of team responsible for action detection.

Technologies Leveraged:

* Pydantic to validate and parse rules.
* Pandas `pd.eval` to run complex operation of large dataset.
* Regex for combining
- Airflow to scheduling workflow.
- Postgres to store and retrieve data.


### Kubernetes Integration for platform for automation and task mining


Successfully integrated automation and task mining platform with Kubernetes and Cloud Platforms.

Contributions:

* Dockerization of existing service (phase-1)
* Design and write platform agnostics libraries various backend.
* Write Helm charts for Kubernetes based installation.

Technologies Leveraged:

* Kubernetes, helm for orchestration and installation.
* Terraform for provisioning.
* Various services for backend:

| Service | AWS | Azure | Bare Metal |
| -- | -- | -- | -- |
| Secret Manager | AWS Secrets Manager  | Azure Key vault | HashiCorp Vault |
| Storage | S3 | Blob Store | Minio |
| Database | RDS | Azure Postgres | Postgres |
| Logging | ELK | ELK  | File system |


### Docs server setup


Create a service for documentation to be hosted on each deployment.
Also deploy same documentation for marketing on existing word press server.

Contributions:

* Convert static documentation into php files to allow authenticated user of WordPress server to access it.
* Create service which serves static documentation behind ngnix in each deployment.
* Automate the process of updating and deploying services to allow self-service by the documentation team.
* Clean up duplicated static files reducing size by 50%.

Technologies Leveraged:

* Azure pipeline: To automate build of new service and deploying files to php server.
* WordPress: Integrating with documentation existing marketing pages.


### Supply Chain Automation


Automated part of supply chain process for a pharmaceutical company.

Contributions:

* Design a framework to parse information from documents using two components:
  * Each parser had to function:
    - identify if it can parse given document.
    - parse the given document.
  * Orchestrator which registered and orchestrated parsing of formats.
* Implement parser to parse multiple formats of data.

Technologies Leveraged:

* Tessract OCR to extract data from searchable pdf.
* PyMuPdf to extra data from searchable pdf.
* Use pandas to extract data from excel.
* Django to server data for validation of extracted data.


### Insurance Process Automation


Automated two business processes for an insurance company.

Contributions:

* Refactored existing code to use command pattern, increasing efficiency and reduced testing time.
* Automate complex web based process using selenium wrappers.
* Automate **wc3270** terminal interaction by parsing screen.


### Automation Framework Development


Established coding guidelines for automation projects.

Contributions:

* A template for automation system setup, utilizing static checkers to ensure code quality
* A dashboard for error analysis and retry automation processes from checkpoint.
* Wrapper libraries for handling secrets, databases, and logging


### Business Transaction Reconciliation(Internship)


Reconciled complex business transactions for an e-commerce company over 6 months at Soroco.

Contributions:

* Reconciled transactions across multiple files, involving intricate business processes
* Successfully utilized Pandas to streamline reconciliation process
* Use pandas internal function for parsing html table which reduce deadline by month.

Technologies Leveraged:

* pandas for faster computation.


## Education


| Degree      | Institution   | Year | Grade |
| ----------- | ------------- | ---- | ----- |
| B.E in C.S. | RVCE          | 2018 | 9.10  |
| P.U.        | Chetan P.U.   | 2014 | 94.83 |
| SSLC        | Chetan School | 2012 | 99.12 |


## Personal Project


### Improving lsp support for vim-ale


* [Add ALEGoToImplementation](https://github.com/dense-analysis/ale/pull/4160)
* [Add CodeAction codeActionLiteralSupport Feature](https://github.com/dense-analysis/ale/pull/4163)


### Todo.conky ([src](https://github.com/sak96/todo.conky))


Todo Widget for Linux desktop widget written in Lua to view todo list.

