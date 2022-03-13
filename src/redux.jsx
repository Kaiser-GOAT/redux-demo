import React, { useState, useContext, useEffect, useMemo } from 'react'

let state = undefined
let reducer = undefined
let listeners = []
const setState = (newState) => {
  state = newState
  listeners.map((fn) => fn(state))
}

export const appContext = React.createContext(null)
const changed = (oldData, newData) => {
  let changed = false
  for (let key in oldData) {
    if (oldData[key] !== newData[key]) {
      changed = true
    }
  }
  return changed
}
const store = {
  getState() {
    return state
  },
  dispatch: (action) => {
    setState(reducer(state, action))
  },
  subscribe(fn) {
    listeners.push(fn)
    return () => {
      const index = listeners.indexOf(fn)
      listeners.splice(index, 1)
    }
  },
}
export const createStore = (_reducer, initialState) => {
  state = initialState
  reducer = _reducer
  return store
}
let dispatch = store.dispatch
const prevDispatch = dispatch
dispatch = (action)=>{
  if(action instanceof Function){
    action(dispatch)
  }else{
    prevDispatch(action)
  }
}
const prevDispatch2 = dispatch;
dispatch = (action)=>{
  if(action.payload instanceof Promise){
    action.payload.then((res)=>{
      dispatch({...action,payload:res})
    })
  }else{
    prevDispatch2(action)
  }
}
export const connect = (selector, mapDispatchToProps) => (Component) => {
  return (props) => {
    const { subscribe } = useContext(appContext)

    const [, update] = useState({})
    const data = useMemo(() => {
      return selector ? selector(state) : { state }
    }, [state])
    const dispatchers = mapDispatchToProps
      ? mapDispatchToProps(dispatch)
      : { dispatch }
    useEffect(
      () =>
        subscribe(() => {
          const newData = selector ? selector(state) : { state }
          if (changed(data, newData)) {
            update({})
          }
        }),
      [subscribe, data]
    )

    return <Component {...props} {...data} {...dispatchers} />
  }
}
export const Provider = ({ store, children }) => {
  return <appContext.Provider value={store}>{children}</appContext.Provider>
}
