import LightThemeMobileBackground from './assets/img/light-theme-mobile-background.png'
import LightThemeDesktopBackground from './assets/img/light-theme-desktop-background.png'
import DarkThemeMobileBackground from './assets/img/dark-theme-mobile-background.png'
import SwitchingLightThemeDarkTheme from './assets/img/switching-light-theme-dark-theme.png'
import SwitchingDarkThemeLightTheme from './assets/img/switching-dark-theme-light-theme.png'
import TodoDelete from './assets/img/icon-todo-delete.png'
import './App.css'
import { useEffect, useState } from 'react'

export default function App() {

  const [darkTheme, setDarkTheme] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('dark-theme', darkTheme ? 'dark' : 'light');
  }, [darkTheme])

  const toggleTheme = () => {
    setDarkTheme(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      // document.documentElement.setAttribute('dark-theme', next ? 'dark' : 'light');
      return next;
    });
  }

  return (
    <>
      <div className="container">
        <header className="header">
          <div className="title-and-switch">
            <h1>TODO</h1>
            {darkTheme ? (
              <img
                src={SwitchingDarkThemeLightTheme}
                onClick={toggleTheme}
                alt=""
              />
            ) : (
              <img
                src={SwitchingLightThemeDarkTheme}
                onClick={toggleTheme}
                alt=""
              />
            )}
          </div>
          {darkTheme ? (
            <img
              src={DarkThemeMobileBackground}
              className='light-theme-mobile-background'
              alt=""
            />
          ) : (
            <img
              src={LightThemeMobileBackground}
              className='light-theme-mobile-background'
              alt=""
            />
          )}
          <img
            src={LightThemeDesktopBackground}
            className='light-theme-desktop-background'
            alt=""
          />
        </header>
        <main className="main">
          <div className="new-todo">
            <input type="radio" name="todo" value="newtodo" id="new-todo-radio" />
            <label htmlFor='new-todo-radio'>Create a new todo…</label>
          </div>
          <div className="todos">
            <div className="todo">
              <input type="radio" name="todo" value="todo" id="todo-radio" />
              <label htmlFor='todo-radio'>Complete online JavaScript course</label>
              <img src={TodoDelete} alt="" />
            </div>
            <div className="todo">
              <input type="radio" name="todo" value="todo" id="todo-radio" />
              <label htmlFor='todo-radio'>Jog around the park 3x</label>
              <img src={TodoDelete} alt="" />
            </div>
            <div className="todo">
              <input type="radio" name="todo" value="todo" id="todo-radio" />
              <label htmlFor='todo-radio'>10 minutes meditation</label>
              <img src={TodoDelete} alt="" />
            </div>
            <div className="todo">
              <input type="radio" name="todo" value="todo" id="todo-radio" />
              <label htmlFor='todo-radio'>Read for 1 hour</label>
              <img src={TodoDelete} alt="" />
            </div>
            <div className="todo">
              <input type="radio" name="todo" value="todo" id="todo-radio" />
              <label htmlFor='todo-radio'>Pick up groceries</label>
              <img src={TodoDelete} alt="" />
            </div>
            <div className="todo">
              <div className="selects">
                <h6>5 items left</h6>
                <h6>Clear Completed</h6>
              </div>
            </div>
          </div>
        </main>
        <footer className="footer">
          <div className="all-active-completed">
            <h6>All</h6>
            <h6>Active</h6>
            <h6>Completed</h6>
          </div>
          <div className="drag-and-drop-area">
            <h6>Drag and drop to reorder list</h6>
          </div>
        </footer>
      </div>
    </>
  )
}