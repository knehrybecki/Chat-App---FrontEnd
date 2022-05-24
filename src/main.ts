import './style/style.sass'
import './style/reset.css'
import { createJoinUserToChat } from './login'
import { io } from "socket.io-client"
import $ from 'jquery'

export const socket = io('http://localhost:3000')

const renderChat = () => {
  const app = $('.app')

  const appChat = $('<div>', {
    class: 'app__chat'
  }).appendTo(app)

  const chat = $('<div>', {
    class: 'chat'
  }).appendTo(appChat)

  $('<div>', {
    class: 'chat__title',
    text: 'Chat App'
  }).prependTo(chat).hide()

  const chatMessage = $('<div>', {
    class: 'chat__message'
  }).appendTo(chat)

  $('<div>', {
    class: 'message'
  }).appendTo(chatMessage)

  const chatInput = $('<div>', {
    class: 'chat__input'
  }).appendTo(chat).hide()

  const input = $('<div>', {
    class: 'input'
  }).appendTo(chatInput)

  $('<i>', {
    class: 'fa-solid fa-image',
  }).appendTo(input)

  $('<input>', {
    type: 'file',
    accept: '.jpg, .jpeg, .png',
    class: 'input--image',
  }).appendTo(input).hide()

  $('<input>', {
    type: 'text',
    placeholder: 'Enter message...',
    class: 'input--text',
    value: ''
  }).appendTo(input)

  $('<button>', {
    class: 'input--button'
  }).append($('<i>', {
    class: 'fa-solid fa-plus'
  })).appendTo(input)
}
renderChat()

export const renderLoginToChat = () => {
  const chatLogin = $('<div>', {
    class: 'chat__join'
  }).prependTo($('.chat'))

  const login = $('<div>', {
    class: 'join'
  }).appendTo(chatLogin)

  $('<div>', {
    class: 'join__title',
    text: 'Chat App'
  }).prependTo(login)

  const loginInput = $('<div>', {
    class: 'join__input'
  }).appendTo(login)

  const labelName = $('<label>', {
    class: 'input--label',
    text: 'User name'
  }).appendTo(loginInput)

  $('<input>', {
    class: 'input--name',
    name: 'name',
    placeholder: 'Enter name...',
  }).prop('required', true).appendTo(labelName)

  const labelRoom = $('<label>', {
    class: 'input--label',
    text: 'Room Name'
  }).appendTo(loginInput)

  $('<input>', {
    class: 'input--room',
    placeholder: 'Room'
  }).prop('required', true).appendTo(labelRoom)

  $('<button>', {
    class: 'join__button',
    text: 'Join Chat'
  }).appendTo(login)
}

renderLoginToChat()
createJoinUserToChat()
