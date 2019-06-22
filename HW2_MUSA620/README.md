# Assignment #2

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/MUSA-620-Spring-2019/assignment-2/master)

### Due Date: 2/13 by the start of class

## Recommended Readings

- [Seaborn example gallery](https://seaborn.pydata.org/examples/index.html)
- [Altair user guide](https://altair-viz.github.io/)

## Reference materials

- [matplotlib](https://matplotlib.org/)
- [seaborn](https://seaborn.pydata.org/)
- [altair](https://altair-viz.github.io/)

## Part 1: Setting up GitHub for assignment submission

We'll be using a new workflow for submitting assignments starting with this assignment. Each assignment, I will provide a GitHub link
to the week's repository. Each student will have their own private repository on GitHub where the assignment can be
submitted.

The invitation link for this week is:

https://classroom.github.com/a/VY9sn2rK

If you do not have a GitHub account yet, you should be prompted to make an account. After clicking on this link, GitHub will create a new private repo with permissions such that only you and the instructors can view the commits.

The assignment should be added to this GitHub repository before the deadline. You can add files to the repository through the web (github.com) interface or using the command line locally on your machine.

Below are some references if you need help:

- [Setting up git](https://help.github.com/articles/set-up-git/)
- [Managing files on GitHub](https://help.github.com/articles/managing-files-on-github/)
- [Managing files via the command line](https://help.github.com/articles/managing-files-using-the-command-line/)

**Important**: files should be committed to the newly created private repository (after following the above link) and _not_ to your forked version of the [assignment-2](https://github.com/MUSA-620-Spring-2019/assignment-2) repository.

## Part 2: Installing the necessary dependencies

You will need to update the `musa` conda environment created as part of last week's assignment. The necessary dependencies are listed in the [conda-environment.yml](conda-environment.yml) file in this repository.

You can update your conda environment from the command line (**not** from within Python):

```bash
conda activate musa
conda env update -f conda-environment.yml
```

Make sure the "conda-environment.yml" file is in the directory that you execute the command from. Note that sometimes it can take a while to "solve" for the environment.

And then you are ready to launch a Jupyter notebook and get started:

```bash
jupyter notebook
```

## Part 3: Exploratory Data Visualization

In this part, you'll use matplotlib, seaborn, and altair to explore a dataset of your choosing and generate some charts in a Jupyter notebook.

### Part 3.1: Selecting a dataset

For this assignment, you can choose your own dataset to explore. I recommend selecting a dataset from [OpenDataPhilly](https://www.opendataphilly.org/). You are welcome to to use a dataset from elsewhere, **but please email me and let me know what you want to analyze.**

Datasets with timestamped entries will be particularly good for analysis, but there are many interesting datasets to consider. They include:

- [311 Requests](https://www.opendataphilly.org/dataset/311-service-and-information-requests)
- [Voter turnout](https://www.opendataphilly.org/dataset/voter-turnout)
- [Complaints against police](https://www.opendataphilly.org/dataset/police-complaints)
- [Parking violations](https://www.opendataphilly.org/dataset/parking-violations)
- [Shooting victims](https://www.opendataphilly.org/dataset/shooting-victims)
- [L+I Violations](https://www.opendataphilly.org/dataset/licenses-and-inspections-violations)

and many more...

For OpenDataPhilly datasets, data files can be downloaded in the form of CSV files.

### Part 3.2: Exploring and generating the charts

From within a Jupyter notebook, you should explore the
datasets and generate charts visualizing different aspects of the data.

**Requirements:**

- 1 Matplotlib chart (of any type)
  - You should consider what aspect of the dataset might be best plotted using matplotlib.
  - You will be graded on aesthetics of the plot, namely, color choices and clarity.
- 1 seaborn chart (of any type)
  - Please include the motivation behind your choice for the type of seaborn plot used and why
- 3 interactive altair plots
  - The following techniques should be used at least once:
    - A transformation (mean, count, binning, etc)
    - Brush selection
    - **Extra credit**: 2-chart dashboard, where filtering of one chart cross-filters the other chart (via `transform_filter()`)
- A short discussion (a sentence or two) of the main conclusion of each chart (in a markdown cell below each chart). It does not need to be interesting or insightful, but it is good practice to always note the main conclusions so the notebook make sense after time passes.

## Submission

Add a `.ipynb` notebook file to your own private repository, as described in part 1 of these instructions.
