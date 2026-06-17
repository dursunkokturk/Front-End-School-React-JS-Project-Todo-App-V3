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
  const [newTodoText, setNewTodoText] = useState("");
  const [filter, setFilter] = useState("all");

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
      return next;
    });
  }

  // Input Elementine Girilen Yeni Gorevi Aliyoruz 
  const addTodo = () => {
    const text = newTodoText.trim();

    // Gorev Yazilmadi Ise Ekleme Islemi Yaptirmiyoruz
    if (!text) return;

    const newTodo = {
      id: Date.now(), // Gecici Benzersiz Id
      todo: text,
      completed: false
    }

    // Son Girilen Gorevi Listenin Basina Aliyoruz
    setTodos(prev => [newTodo, ...prev]);

    // Yeni Gorev Ekleme Isleminden Sonra 
    // Input Elementinin Icini Siliyoruz
    setNewTodoText("");
  }

  // Enter Tusu Ile Yeni Gorev Ekleme Islemi
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // Tamamlanmamis Todo Sayisi
  const activeCount = todos.filter(todo => !todo.completed).length;

  // Todo Sil (Sadece state'ten — dummyjson Gercek Silme Yapmaz)
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // Gorevler Listesinde Tamamlanmis ve 
  // Tamamlanmamis Tum Tum Gorevleri Listeliyoruz
  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  })

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
            <input
              type="checkbox"
              name="todo"
              id="new-todo-check"
              disabled
            />
            <input
              type="text"
              name="new-todo-text"
              id="new-todo-text"
              value={newTodoText}
              placeholder='Create a new todo'
              onChange={(e) => {
                setNewTodoText(e.target.value)
              }}
              onKeyDown={handleKeyDown}
              className='new-todo-text'
            />
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

            {!loading && !errors && filteredTodos.map(todo => (
              <div className="todo" key={todo.id}>
                <div className="checkbox-wrapper">

                  <input
                    type="checkbox"
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onChange={() => {
                      setTodos(prev =>
                        prev.map(
                          t => t.id === todo.id ? { ...t, completed: !t.completed } : t
                        ))
                    }}
                    name="todo"
                    value="todo"
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
                  className='delete-icon'
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
            <h6
              style={{ cursor: "pointer" }}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "active-filter" : ""}
            >
              All
            </h6>
            <h6
              style={{ cursor: "pointer" }}
              onClick={() => setFilter("active")}
              className={filter === "active" ? "active-filter" : ""}
            >
              Active
            </h6>
            <h6
              style={{ cursor: "pointer" }}
              onClick={() => setFilter("completed")}
              className={filter === "completed" ? "active-filter" : ""}
            >
              Completed
            </h6>
          </div>
          <div className="drag-and-drop-area">
            <h6>Drag and drop to reorder list</h6>
          </div>
        </footer>
      </div>
    </>
  )
}