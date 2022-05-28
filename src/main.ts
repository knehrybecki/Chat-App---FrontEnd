import $ from 'jquery'
import { io } from 'socket.io-client'
import { createJoinUserToChat } from './login'
import './style/reset.css'
import './style/style.sass'

export const socket = io('http://localhost:3000')

const renderChat = () => {
  const app: JQuery<HTMLElement> = $('.app')

  const appChat: JQuery<HTMLElement> = $('<div>', {
    class: 'app__chat'
  }).appendTo(app)

  const chat: JQuery<HTMLElement> = $('<div>', {
    class: 'chat'
  }).appendTo(appChat)

  $('<div>', {
    class: 'chat__title',
    text: 'Chat App'
  }).prependTo(chat).hide()

  const chatMessage: JQuery<HTMLElement> = $('<div>', {
    class: 'chat__message'
  }).appendTo(chat)

  $('<div>', {
    class: 'message'
  }).appendTo(chatMessage)

  const chatInput: JQuery<HTMLElement> = $('<div>', {
    class: 'chat__input'
  }).appendTo(chat).hide()

  const input: JQuery<HTMLElement> = $('<div>', {
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
  const chatLogin: JQuery<HTMLElement> = $('<div>', {
    class: 'chat__join'
  }).prependTo($('.chat'))

  const login: JQuery<HTMLElement> = $('<div>', {
    class: 'join'
  }).appendTo(chatLogin)

  $('<div>', {
    class: 'join__title',
    text: 'Chat App'
  }).prependTo(login)

  const loginInput = $('<div>', {
    class: 'join__input'
  }).appendTo(login)

  const labelName: JQuery<HTMLElement> = $('<label>', {
    class: 'input--label',
    text: 'User name'
  }).appendTo(loginInput)

  $('<input>', {
    class: 'input--name',
    name: 'name',
    placeholder: 'Enter name...',
  }).prop('required', true).appendTo(labelName)

  const labelRoom: JQuery<HTMLElement> = $('<label>', {
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
