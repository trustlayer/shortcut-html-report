# Shortcut Iteration Report Action

This action gives you an HTML with all the issues in "Deployed to production" state showed in a simple way + links

## Inputs

## `iterationId`

**Required** String for the name of the iteration (can be only a part of it)
example:

```sh
"My awesome iteration v.1.2.3"
                        ^---^  This works
       ___________________|
input: 1.2.3
```
## `worflowStateId`

**Required** The id of the workflow you want to get the data

## Outputs

## `reportPath`

Html Report path

## Example usage

```yml
uses: actions/shortcut-iteration-report@v1.0
with:
  iterationId: '1.2.34'
  worflowStateId: '5050594904'
env:
  SLACK_WEBHOOK_URL: ${{ secrets.SC_TOKEN }}
```