import { DsTimelineWidgetPage } from './app.po';

describe('ds-timeline-widget App', function() {
  let page: DsTimelineWidgetPage;

  beforeEach(() => {
    page = new DsTimelineWidgetPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
