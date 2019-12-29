[![npm][npm]][npm-url] 
[![Build Status][build-status]][build-status-url] 
[![Maintainability][maintainability]][maintainability-url] 
 
Данная библиотека вдохновлена Redux и использует некоторые ее идеи.  
Пример использования на React.  

<h1> Использование</h1> 
<h2 id="#contents">Оглавление</h2> 
<a href="#install">1.Установка</a>    
<a href="#driver">2.Компонент, загружающий данные в хранилище.</a>    
<a href="#driven">3.Компонент, получающий данные из хранилища.</a>  
<a href="#reducer">4.Настройка reducers. аналог reducers в redux.</a>  
<a href="#features">5.Дополнительные возможности.</a>  

  
<h3>1.Установка</h3>
```js
npm i galinka --save
``` 
<h3 id="driver">2. В компоненте, который загружает данные в хранилище</h3> 
<strong color="blue">(в примере /example/components/InputComponent.jsx)</strong>  


    а)Импортируй G  
    ```js
    import G from '../../galinka';
    ```
    б)Создай константу, вызвав G. Обязательный аргумент - имя хранилища.  
    ```js
    const inputStore = G('toDos');
    ``` 
    Данная константа используется для взаимодействия с хранилищем. Если в компоненте используются разные хранилища, то для каждого создай константу, вызвав G с артументом, соответствующем имени данного хранилища.  

    в)Чтобы поместить данные в хранилище вызови на соответствующей его имени константе метод updateStore:  
     ```js
       inputStore.updateStore('add', data);
     ```
   где первый аргумент - название метода обработки данных(см.ниже) для данного хранилища, а второй - данные.  

    Если нужно выполнить upgrade данных в нескольких хранилищай, создай для каждого хранилища свою кнстанту,вызвав G с именем нужного хранилиза и на ней вызови метод апдейта(updateStore)  

<a href="#contents">к оглавлению</a>  
<h3 id="driven">3.В компоненте, который использует данные из хранилища:</h3>  
    а, б аналогичны. Аргументом передай название хранилища, из которого будешь брать данные.
    Если нужно использовать несколько хранилищ, то есть несколько вариантов:  

        1)сделай несколько констант, вызвав функцию G c обязательным аргументом - именем соответствующего хранилища:  
         ```js
         const toDosStoreInstance = G('toDos');
         const someNextStoreInstance = G('someNextStore');
         ```  

         и на каждой константе вызови метод  getStore
         ```js
         const toDosStore = toDosStoreInstance.getStore();
         const someNextStore = someNextStoreInstance.getStore();
         ```  

        вернется соответствующее имени хранилище.   
          
        2)сделай одну константу, вызвав функцию G с обязательным аргументом - именем любого(можно основного) хранилища.  
          ```js
          const toDosStoreInstance = G('toDos');
          ```  
          и для каждого требуемого хранилища выполни вызов метода с его именем:  
          ```js
          const toDosStore = toDosStoreInstance.getStore('toDos');
          const someNextStore = toDosStoreInstance.getStore('someNextStore');
          ```   
          
          ВНИМАНИЕ!!! Аргумент - название хранилища - обязательно  

    г) единожды для каждого компонента, использующего G добавь функцию, вызывающую перерендеринг страницы:
        ```js
        componentDidMount = () => {
                inputStore.addRenderFunc(this.state, 'toDos', 'someUniqueId');
            };
        ```  
        первый аргумент - функция, второй - на какое хранилище подписываемся, третий - постоянный уникальный ID. по нему будет происходить защита от дублей, если ты ошибочно будешь вызывать эту функцию несколько раз, например в рендере.Важно, чтобы данный ID не меялся и был уникальным для каждого компонента.
        ВАЖНО! В идеале добавляй эту функцию в том месте, которое вызывается лишь однажды за жизненный цикл компонента.
        В React я просто передаю setState в ComponentDidMount.  
        Именно это место связывает хранилище и фреймворк(библиотеку react в данном случае)  

<a href="#contents">к оглавлению</a>
<h3 id="reducer">4.Настройка функций обработки хранилищ - reducers:</h3>  
       Удобно выполнять в отдельной папке в отдельных файлах для каждого store.  
       (В примере это /examples/reducers/toDos.js)  
       а)импортируй G  
           ```js
           import G from '../../galinka';
           ```

       б)сделай одну константу, вызвав G с аргументом - обязательным именем хранилища:    
           ```js
           const inputStoreInstance = G('toDos');
           ```  

       в)задай все функции обработчики данного хранилища.  
       У каждой функции обработчика первый аргумент - данные, второй - старое хранилище. Оба обязательны.  
       Возвращать функция должна новое хранилище:  
        ```js
        const del = (id, oldState = []) => oldState.filter(item => !(item.id === id));
        const add = (data, oldState = []) => [data, ...oldState];
        ```  

        Обрати внимание, я задаю дефолтное значение старого хранилища в аргументе функции. G ничего не знает о функциях-обработчиках,
        поэтому подобное дефолтное значение позволит избежать ошибок при первом обращении к функции.  

        г)Структура хранилища - не зона ответственности G. Ты задаешь структуру самостоятельно.  
        Хорошая практика - указывать структуру данного хранилища в начале файла:  
       ```js
       const thisStoreStructure = [
       		{
       			id:'someUniqueId',
       			data:'some string data',
       		},
       		{
       			id:'someAnotherUniqueId',
       			data:'some another string data',
       		},
       	];
       	```  

       	д)Добавь функции-обработчики текущего хранилища. Для каждой функции создай объект вида  
       	   ```js
       	   const addObj = {
           		type: 'add',
           		updateFunc: add,
           	};
           	const delObj = {
            		type: 'del',
            		updateFunc: del,
            	};
       	   ```  

       	   где оба свойства - обязательные.  
       	   свойство из поля type ты потом будешь вызывать при обновлении хранилища (updateStore('add', data), см п.1)  
       	   свойство из поля update - это сама функция обработчик (const add = (data, oldState = []) => [data, ...oldState];)  
       	   
       	   далее есть 2 варианта:  

       	   1)Функций несколько: на константе созданной вызовом G, вызови метод addReducers куда передай массив сформированных выше объектов:  
       	   ```js
       	   toDos.addReducers([addFuncObj, delFuncObj]);
       	   ```  

       	   2)Функция одна. на константе созданной вызовом G, вызови метод addReducer, куда передай сформированный выше объект:  
       	   ```js
       	   toDos.addReducer(addFuncObj);
       	   ```
       	е)Подключи файлы конструкторов store к проекту, например проимпортировав их в js точке входа проекта или подключив скриптом в html точке входа  
<a href="#contents">к оглавлению</a>
<h3 id="features">5.Дополнительные возможности.</h3>  

        а) История. На данный момент эта фича отключена.  
            При каждом обновлении store, старое состояние хранилищ сохраняется.   
            Можно использовать историю состояний. Метод getFullHistory вернет массив всех состояний, последовательно измененных.  
            По дефолту история выключена, так как сохраняются полный объект всех хранилищ и при длительном использовании это может вызывать утечки памяти.  
            Чтобы включить - на любом инстансе класса Galinka вызови метод enableHistory();  
            Если понадобится выключить историю - на любом инстансе класса Galinka вызови метод disableHistory();  
            Хорошей практикой считается указание всех параметров в отдельном файле.  
<a href="#contents">к оглавлению</a>


[npm]: https://img.shields.io/npm/v/galinka.svg
[npm-url]: https://www.npmjs.com/package/galinka
[build-status]: https://travis-ci.org/euhoo/galinka.svg?branch=master
[build-status-url]: https://travis-ci.org/euhoo/galinka
[maintainability]: https://api.codeclimate.com/v1/badges/f36f38ccabd9ea831096/maintainability
[maintainability-url]: https://codeclimate.com/github/euhoo/galinka/maintainability
       
       
