---
sidebar_label: 'Inventory System Introduction'
sidebar_position: 3
---

# Inventory System Introduction

## Feature Overview

The Inventory System has been designed to be as easy to use, and easy to extend. You can extend the Inventory Component
 to add in as many additional features as you require and overwrite the functions provided to produce custom behaviour.

It uses the FastArraySerializer to only replicate the data that has changed. To make working with this easier, we have 
plenty of utility functions to use this feature. 


### Inventory System Features

- Fully Replicated Inventory Component:
  - Feature Set:
    - Adding and Removing Items
    - Transferring Items between Inventories
    - Using Items
    - Dropping Items
  - Utility Functions to retrieve data about the current
    inventory and the current state of it
  - Events for when the state of the inventory changes,
    that work on both Server and Client
  - Function Library to expose common Utility functions that aren't natively supported. 
######
- Items:
  - Can be defined as individual assets, so
    can be loaded separately.
  - Different Item Class for different behaviour
  - Interfaces to retrieve information
  - Separates the Inventory Items from the Actors,
    to lessen the network load whilst maintaining functionality


