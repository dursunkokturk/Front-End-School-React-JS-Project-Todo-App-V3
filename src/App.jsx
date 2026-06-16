import LightThemeMobileBackground from './assets/img/light-theme-mobile-background.png'
import LightThemeDesktopBackground from './assets/img/light-theme-desktop-background.png'
import DarkThemeMobileBackground from './assets/img/dark-theme-mobile-background.png'
import DarkThemeDesktopBackground from './assets/img/dark-theme-desktop-background.png'
import SwitchingLightThemeDarkTheme from './assets/img/switching-light-theme-dark-theme.png'
import SwitchingDarkThemeLightTheme from './assets/img/switching-dark-theme-light-theme.png'
import Check from './assets/img/check.png'
import TodoDelete from './assets/img/icon-todo-delete.png'
import './App.css'
import { useEffect, useState } from 'react'

const API_URL = 'https://dummyjson.com/todos';

export default function App() {

  const [darkTheme, setDarkTheme] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('dark-theme', darkTheme ? 'dark' : 'light');
  }, [darkTheme])

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setErrors(null);

        const response = await fetch(`${API_URL}?_limit=5`);
        if (!response.ok) {
          throw new Error(`Hata:${response.status}`);
        }

        const data = await response.json();

        // API Uzerinden Gelen Cevaba Bakiyoruz
        console.log('Data', data);

        // API Uzerinden Gelen Cevaplar Arasindan Kullanacagimiz Listeyi Aliyoruz
        const todoList = data.todos;
        console.log('TodoList', todoList);

        // Aldigimiz Listeyi useState'e Gonderiyoruz
        setTodos(todoList);
      } catch (error) {

        // Data'yi Alma Asamasinda Bir Hata Olursa useState Uzerinden Aliyoruz
        setErrors(error.message);

        console.log('fetch Hatasi', errors);
      } finally {
        // Hata Olsa Da Olmasa Da loading Biter
        setLoading(false);
      }
    }
    fetchTodos();
  }, [])

  const toggleTheme = () => {
    setDarkTheme(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      // document.documentElement.setAttribute('dark-theme', next ? 'dark' : 'light');
      return next;
    });
  }

  // Tamamlanmamis Todo Sayisi
  const activeCount = todos.filter(todo => !todo.completed).length;

  // Todo Sil (Sadece state'ten — dummyjson Gercek Silme Yapmaz)
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

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
            src={darkTheme ? DarkThemeDesktopBackground : LightThemeDesktopBackground}
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

            {/* Todos'lar Alinirken Yuklendigini Belirtiyoruz */}
            {loading && (
              <div className="todo">
                <label>Yükleniyor...</label>
              </div>
            )}

            {/* Todo'larin Api Uzerinden Alinmasi Asamasinda Hata Olursa Gosteriyoruz */}
            {errors && (
              <div className="todo">
                <label style={{ color: 'red' }}>{errors}</label>
              </div>
            )}

            {!loading && !errors && todos.map(todo => (
              <div className="todo" key={todo.id}>
                <div className="checkbox-wrapper">

                  <input
                    type="checkbox"
                    id={`todo.${todo.id}`}
                    defaultChecked={todo.completed}
                    onChange={() => {
                      setTodos(prev =>
                        prev.map(
                          t => t.id === todo.id ? { ...t, completed: !t.completed } : t
                        ))
                    }}
                    name="todo"
                    value="todo"
                    id="todo-radio"
                  />
                  {todo.completed && (
                    <img
                      src={Check}
                      className='check-icon'
                      alt=""
                    />
                  )}
                </div>
                <label
                  htmlFor={`todo-${todo.id}`}
                  style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                >
                  {todo.todo}
                </label>
                <img
                  src={TodoDelete}
                  alt="sil"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    deleteTodo(todo.id)
                  }}
                />
              </div>
            ))}

            {!loading && (
              <div className="todo">
                <div className="selects">
                  <h6>{activeCount} items left</h6>
                  <h6
                    style={{ cursor: 'pointer' }}
                    onClick={() => setTodos(
                      prev => prev.filter(t => !t.completed)
                    )}
                  >
                    Clear Completed
                  </h6>
                </div>
              </div>
            )}
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