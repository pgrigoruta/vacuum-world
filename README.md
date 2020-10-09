# Vacuum World

## General

Peter Norving's AIMA vacuum world simulator. Supports a few agent types and environment configurations. Written in Javascript.

![demo](https://github.com/pgrigoruta/vacuum-world/blob/main/demo.gif?raw=true)

## Running

Open index.html

## Description

The simulation can render 2x2 environments with clean/dirty squares and obstacles. The agent can be positioned at any point in the grid. 
Reflex and model based agents are implemented.
A few templates are defined to match a few of the proposed exercise environments.

## Configuration

* Rows / Cols - number of rows and cols for the environment
* Agent start X / Y - start position
* Dirty squares: Specify each as X1,Y1|X2,Y2|X3,Y3, or use random.
* Blocked squares: Specify each as X1,Y1|X2,Y2|X3,Y3, or use random.
* Agent class - defines the agent behaviour. See js/agent.js for the implementation
* Perception type - can define the perception as either positional (agents gets X and Y) or bump (agent knows whether the last move action failed or not)
* Performance Measure - defined performance measure, implementation in js/env.js
* Time steps - place a limit on the simulation length
* Time between actions (ms) - pause between action. You have the option to also "Advance Manually", i.e. click to make the next step. Particularly useful when debugging

