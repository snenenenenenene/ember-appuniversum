# App with breadcrumbs

---

{{#docs-demo as |demo|}}
  {{#demo.example name='app-with-breadcrumbs.hbs'}}
    <AuApp>
      <AuMainHeader @brandLink="https://www.vlaanderen.be/nl" @homeRoute="docs.templates.app-sidebar" @appTitle="App title" @contactRoute="docs.templates.app-sidebar">
        <AuDropdown @dropdownTitle="Aangemeld als ..." @dropdownButtonLabel="Account settings" @alignment="right">
          <AuButton @skin="tertiary" role="menuitem">
            <AuIcon @icon="logout" @alignment="left" />Afmelden
          </AuButton>
        </AuDropdown>
      </AuMainHeader>
      <AuToolbar @size="medium" @skin="tint" @border="bottom">
        <AuToolbarGroup>
          <ul class="au-c-list-horizontal au-c-list-horizontal--small">
            <li class="au-c-list-horizontal__item">
              <AuLink @linkRoute="index">
                <AuIcon @icon="arrow-left" @alignment="left" />
                Overzicht modules
              </AuLink>
            </li>
            <li class="au-c-list-horizontal__item">
              Test
            </li>
          </ul>
        </AuToolbarGroup>
      </AuToolbar>
      <AuMainContainer as |m|>
        <m.content @scroll={{true}}>
          <div class="au-d-component-block au-d-component-block--overflow">
            Main content
          </div>
        </m.content>
      </AuMainContainer>
    </AuApp>
  {{/demo.example}}
  {{demo.snippet 'app-with-breadcrumbs.hbs'}}
{{/docs-demo}}