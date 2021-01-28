import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import QuizContainer from '../src/components/QuizContainer';
import AlternativesForm from '../src/components/AlternativeForm';

function LoadingWidget() {
  return(
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>
      <Widget.Content>
        .......
      </Widget.Content>
    </Widget>
  );
}

function ResultWidget({results}) {
  //var totalDeAcertos = results.reduce((somatoriaAtual, resultAtual) => {
  //  return (resultAtual === true) ? somatoriaAtual + 1 : somatoriaAtual;
  //}, 0);
  var totalDeAcertos = results.filter((x) => x).length;

  return(
    <Widget>
      <Widget.Header>
        Resultado
      </Widget.Header>
      <Widget.Content>
        Você acertou {totalDeAcertos} perguntas!
        <ul>
          {results.map((result, index) => {
            <li>
              # {index + 1} Resultado: 
              {result === true ? 'Acertou' : 'Errou'}
            </li>
          })}
        </ul>
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({question,questionIndex, totalQuestions, onSubmit,addResult}){
  const questionId = `question__${questionIndex}`;
  const [isQuestionSubmitted, setIsQuestionSubmitted] = React.useState(false);
  const [selectedAlternative,setSelectedAlternative] =  React.useState(undefined);
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  return(
      <Widget>
          <Widget.Header>
            <h1>{`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h1>
          </Widget.Header>
          <img
            alt="Descrição"
            style={{
              width: '100%',
              height: '150px',
              objectFit: 'cover'
            }}
            src={question.image}
          />
          <Widget.Content>
            <h2>{question.title}</h2>
            <p>{question.description}</p>

            {/*<pre>
              {JSON.stringify(question, null, 4)}
            </pre>*/}

            <AlternativesForm 
              onSubmit={(events) => {
                events.preventDefault();
                setIsQuestionSubmitted(true);
                setTimeout(() => {
                  addResult(isCorrect);
                  onSubmit();
                  setIsQuestionSubmitted(false);
                  setSelectedAlternative(undefined);
                }, 3 * 1000); 
              }}>
              {question.alternatives.map((alternative, alternativeIndex) => {

                const alternativeId = `alternative_${alternativeIndex}`;
                const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
                const isSelected = selectedAlternative === alternativeIndex;

                return (
                  <Widget.Topic 
                    as="label" 
                    key={alternativeId} 
                    htmlFor={alternativeId} 
                    data-selected={isSelected} 
                    data-status={isQuestionSubmitted && alternativeStatus}
                    >

                    <input style={{display: 'none'}} id={alternativeId} name={questionId} onChange={() => setSelectedAlternative(alternativeIndex)} type="radio"/>
                    {alternative}
                  </Widget.Topic>
                );
              })}

              <Button type="submit" disabled={!hasAlternativeSelected}>Confirmar</Button>
              {isQuestionSubmitted && isCorrect && <p>Você acertou!</p>}
              {isQuestionSubmitted && !isCorrect && <p>Você errou!</p>}
            </AlternativesForm>
          </Widget.Content>
        </Widget>    
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

export default function QuizPage() {

  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults] = React.useState([]);
  const totalQuestions = db.questions.length;
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const question = db.questions[questionIndex];

  function addResult(result) {
    // results.push(result);
    setResults([
      ...results,
      result,
    ]);
  }

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1* 1000)
  }, []);

  
  function handleSubmit() {

    const nextQuestion = questionIndex + 1;
    if(nextQuestion < totalQuestions)
    {
      setQuestionIndex(nextQuestion);
    }else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        
        {screenState === screenStates.LOADING && <LoadingWidget />}
        {screenState === screenStates.QUIZ && <QuestionWidget question={question} questionIndex={questionIndex} totalQuestions={totalQuestions} onSubmit={handleSubmit}  addResult={addResult}/>}
        {screenState === screenStates.RESULT && <ResultWidget results={results} />}
        
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/omariosouto" />
    </QuizBackground>
  );
}
