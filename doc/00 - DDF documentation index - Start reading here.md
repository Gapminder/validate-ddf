this is a .md file snapshot of the google document available publicly [here](https://docs.google.com/document/d/1wQ9hp3OoLKE3oor2TtSxXx4QMkEqEtoEYDfzQASfA6E). it may deviate and it doesn't retain pictures and tabled from the google doc properly. google doc is the source of truth!

# An introduction to DDF

DDF is a data model for collaborative harmonization of multidimensional statistics. 

Let’s break this sentence down.

* **Data model**  
  DDF is a data model, meaning it describes a way to organize data and to define how pieces of data relate to each other.  
* **Harmonization**  
  DDF can be used for data harmonization, meaning it can combine data from different sources into integrated, consistent and unambiguous data sets. DDF supports a practical workflow that results in an easy to maintain and ever growing collection of comparable data.[^1]  
* **Collaborative**.  
  DDF is the common data model in [open numbers](http://open-numbers.github.io/). Open numbers is an initiative to crowdsource and harmonize world-data.  
* **Multidimensional statistics**  
  DDF is designed to store statistics with multiple dimensions. For example population per country, per year, per gender, per age group.

# The universe of DDF

To use DDF effectively, it comes with data formats and a query language. 

## **The model: DDF**

As said above, DDF is a data model. It is a system to organize data and to define how pieces of data relate to each other. DDF itself does not specify the format in which the data is stored. It doesn’t matter if it’s stored in csv-files, an SQL database or a graph database. In other words: DDF is a conceptual model.  
[Read about the DDF conceptual model.](https://docs.google.com/document/d/1Cd2kEH5w3SRJYaDcu-M4dU5SY8No84T3g-QlNSW6pIE/edit#heading=h.5h1e33vzhdlu)

## **The formats: DDFcsv and DDFsql**

However, a conceptual model is not enough for pragmatical use. We need to define how to store DDF-data in the real world, in files, on disks. DDF needs a data format. Two formats have been defined for two different purposes: *DDFcsv* and *DDFsql*. 

*DDFcsv* is a tabular representation of DDF-data in the well known comma separated values format (csv). DDFcsv is easy to work with for people who are familiar with tabular data and allows easy transformation from other tabular models to DDF. It's meant to be read by both humans and machines.   
[Read about DDFcsv](https://docs.google.com/a/gapminder.org/document/d/1aynARjsrSgOKsO1dEqboTqANRD1O9u7J_xmxy8m5jW8/edit?usp=drive_web)

In the future, it is very well possible that DDF will be represented in other formats for different purposes.  

## **The Query Language: DDFQL**

To retrieve data from DDF we have developed the DDF Query Language *DDFQL*. This query language has a strong likeness to SQL with specific features to support the possibilities of the DDF data model.  
[Read more about DDFQL](https://docs.google.com/document/d/1olFm-XXjWxQ4LrTCfM42an6LbjbIgnt__V1DZxSmnuQ/edit#)

[^1]:   This functionality is not explicitly documented yet but will be in future versions.