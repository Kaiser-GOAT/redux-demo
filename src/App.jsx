import './App.css'
import React, { useState, useContext, useEffect } from 'react'
import { appContext, createStore, connect,Provider } from './redux'
import { connectToUser } from './connecters/connectToUser'

function App() {
  // const [appState, setAppState] = useState({
  //   user: { name: 'kaiser', age: 26 },
  // })
  const reducer = (state, { type, payload }) => {
    if (type === 'updateUser') {
      return {
        ...state,
        user: {
          ...state.user,
          ...payload,
        },
      }
    } else {
      return state
    }
  }
  const store = createStore(reducer, {
    user: { name: 'kaiser', age: 26 },
    group: { name: '前端' },
  })
  return (
    <Provider store={store}>
    <FirstChild />
    <SecondChild />
    <LastChild />
  </Provider>
  )
}
const FirstChild = () => (
  <div>
    first <User />
  </div>
)
const SecondChild = () => (
  <div>
    second <UserModifier />
  </div>
)

const LastChild = connect((state) => {
  return { group: state.group }
})(({ group }) => <div>last{group.name}</div>)

const User = connectToUser(({ user }) => {
  return <div>USer:{user.name}</div>
})

const UserModifier = connectToUser(({ updateUser, user }) => {
  const onChange = (e) => {
    updateUser({ name: e.target.value })
  }
  return (
    <div>
      <input value={user.name} onChange={onChange} />
    </div>
  )
})
export default App
