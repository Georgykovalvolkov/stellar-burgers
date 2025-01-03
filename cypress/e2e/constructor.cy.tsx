describe('интерграционное тестирование', () => {
  beforeEach(() => {
    cy.intercept('GET', `api/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('http://localhost:4000/');
  });

  afterEach(() => {
    cy.clearCookies();
  });

  it('добавление ингредиентов и булки в конструктор', () => {
    cy.wait('@getIngredients');

    cy.get('[data-ingredient="bun"]').find(`button`).first().click();

    cy.get('[data-ingredient="noBun"]').find('button').first().click();

    cy.get('[data-constructor="bun"]')
      .eq(0)
      .find('.constructor-element__text')
      .should('have.text', 'Флюоресцентная булка R2-D3 (верх)');

    cy.get('[data-constructor="bun"]')
      .eq(1)
      .find('.constructor-element__text')
      .should('have.text', 'Флюоресцентная булка R2-D3 (низ)');

    cy.get('[data-constructor="noBun"]')
      .find('.constructor-element__text')
      .should('have.text', 'Хрустящие минеральные кольца');
  });

  describe('тестирование работы модальных окон', () => {
    it('открытие модального окна ингредиента', () => {
      cy.get('[data-ingredient="bun"]').find('[data-ingredient="name"]').contains('Флюоресцентная булка R2-D3').click();

      cy.get('[id="modals"]').should('not.be.empty');

      cy.get('[data-ingredient="modal-name"]').should('have.text', 'Флюоресцентная булка R2-D3');
    });

    it('закрытие по клику на крестик', () => {
      cy.get('[data-ingredient="noBun"]').first().click();

      cy.get('[id="modals"]').find('button').click();

      cy.get('[id="modals"]').should('be.empty');
    });

    it('закрытие по клику на оверлей', () => {
      cy.get('[data-ingredient="noBun"]').eq(1).click();

      cy.get('[data-cy=modal-overlay]').click('left', { force: true });

      cy.get('[id="modals"]').should('be.empty');
    });
  });

  describe('Собирается бургер', () => {
    beforeEach(() => {
      cy.intercept('GET', `api/auth/user`, {
        fixture: 'user.json'
      }).as('getUser');

      const mockToken = 'mockToken1134';
      localStorage.setItem('accessToken', mockToken);
    });
    it('Создание и оформление заказа', () => {
      cy.wait('@getUser');

      cy.get('[data-ingredient="bun"]').find(`button`).first().click();
      cy.get('[data-ingredient="noBun"]').find('button').first().click();
      cy.get('[data-ingredient="noBun"]').find('button').eq(1).click();

      cy.get('[data-constructor="bun"]').should('have.length', 2);
      cy.get('[data-constructor="noBun"]').should('have.length', 2);

      cy.intercept('POST', `api/orders`, {
        fixture: 'order.json'
      }).as('createOrder');

      cy.get('[data-cy=order-button]').find('button').click();
      cy.wait('@createOrder');

      cy.get('[id="modals"]').should('not.be.empty');

      cy.get('[id="modals"]').find('h2').should('have.text', '64593');

      cy.get('[id="modals"]').find('button').click();

      cy.get('[id="modals"]').should('be.empty');

      cy.get('[data-constructor="bun"]').should('have.length', 0);
      cy.get('[data-constructor="noBun"]').should('have.length', 0);
    });
  });
});
