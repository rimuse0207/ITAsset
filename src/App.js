import RouterMainPage from "./Router";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RouterMainPage></RouterMainPage>
        {/* 로딩 컴포넌트 시작 */}

        {/* <Loader loading={Loading}></Loader> */}

        {/* 로딩 컴포넌트 끝 */}
      </header>
    </div>
  );
}

export default App;
