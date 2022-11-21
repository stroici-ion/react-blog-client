import classNames from 'classnames';
import React, { HtmlHTMLAttributes } from 'react';

import styles from './styles.module.scss';

type PaginationType = {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

const Pagination: React.FC<PaginationType> = ({ totalPages = 20, currentPage, setCurrentPage }) => {
  const onClickSelectPage = (page: number) => {
    setCurrentPage(page);
  };

  const onClickNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const onClickPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getPageNumber = (index: number) => {
    return totalPages - ((currentPage > totalPages - 5 ? 5 : 1) - index);
  };

  const onClickLeftMiddle = () => {
    setCurrentPage(currentPage - 3);
  };
  const onClickRightMiddle = () => {
    if (currentPage > 5 && currentPage < totalPages - 4) {
      setCurrentPage(currentPage + 3);
      return;
    }
    if (currentPage < 6) {
      setCurrentPage(8);
    }
    if (currentPage > totalPages - 6) setCurrentPage(totalPages - 7);
  };

  return (
    <div className={styles.pagination}>
      <div className={styles.pages}>
        <button onClick={onClickPreviousPage} className={styles.pages__previous}>
          ⮞
        </button>
        {totalPages <= 9 ? (
          [...Array(totalPages)].map((item, index) => (
            <button
              key={index}
              onClick={() => onClickSelectPage(index + 1)}
              className={classNames(
                styles.pages__page,
                currentPage === index + 1 && styles.active,
              )}>
              {index + 1}
            </button>
          ))
        ) : (
          <>
            {' '}
            {[...Array(currentPage <= 5 ? 6 : 2)].map((item, index) => (
              <button
                key={index}
                onClick={() => onClickSelectPage(index + 1)}
                className={classNames(
                  styles.pages__page,
                  currentPage === index + 1 && styles.active,
                )}>
                {index + 1}
              </button>
            ))}
            {currentPage > 5 && currentPage <= totalPages - 5 && (
              <>
                <button className={styles.pages__middle} onClick={onClickLeftMiddle}>
                  ...
                </button>
                <button
                  onClick={() => onClickSelectPage(currentPage - 1)}
                  className={styles.pages__page}>
                  {currentPage - 1}
                </button>
                <button
                  onClick={() => onClickSelectPage(currentPage)}
                  className={classNames(styles.pages__page, styles.active)}>
                  {currentPage}
                </button>
                <button
                  onClick={() => onClickSelectPage(currentPage + 1)}
                  className={styles.pages__page}>
                  {currentPage + 1}
                </button>
              </>
            )}
            <button className={styles.pages__middle} onClick={onClickRightMiddle}>
              ...
            </button>
            {[...Array(currentPage > totalPages - 5 ? 6 : 2)].map((item, index) => (
              <button
                key={index}
                onClick={() => onClickSelectPage(getPageNumber(index))}
                className={classNames(
                  styles.pages__page,
                  currentPage === getPageNumber(index) && styles.active,
                )}>
                {getPageNumber(index)}
              </button>
            ))}
          </>
        )}
        <button className={styles.pages__next} onClick={onClickNextPage}>
          ⮞
        </button>
      </div>
      <div className={styles.goto}></div>
    </div>
  );
};

export default Pagination;
