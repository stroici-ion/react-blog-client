import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../../../redux/auth/selectors';

import ContextMenu from '../../../ContextMenu';

interface ICommentContextMenu {
  className?: string;
  isPinnedByAuthor?: boolean;
  buttons: {
    editButton: any;
    deleteButton: any;
    reportButton: any;
    pinButton?: any;
    unpinButton?: any;
  };
  ownerId: string;
  commentOwnerId: string;
}

const CommentContextMenu: React.FC<ICommentContextMenu> = ({
  buttons,
  className,
  isPinnedByAuthor,
  ownerId,
  commentOwnerId,
}) => {
  const userId = useSelector(selectUserData)?._id;

  return (
    <ContextMenu className={className}>
      {commentOwnerId === userId ? (
        <>
          {ownerId === userId &&
            (isPinnedByAuthor ? buttons.unpinButton : buttons.pinButton)}
          {buttons.editButton}
          {buttons.deleteButton}
        </>
      ) : (
        <>
          {ownerId === userId &&
            (isPinnedByAuthor ? buttons.unpinButton : buttons.pinButton)}
          {buttons.reportButton}
          {ownerId === userId && buttons.deleteButton}
        </>
      )}
    </ContextMenu>
  );
};

export default CommentContextMenu;
